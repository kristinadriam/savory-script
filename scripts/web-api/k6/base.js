import http from 'k6/http';
import { Trend, Rate } from 'k6/metrics';
import { check, sleep } from 'k6';

const responseTimes = {};
responseTimes.categories = new Trend('response_time_categories', true);
responseTimes.cuisines = new Trend('response_time_cuisines', true);
responseTimes.ingredients = new Trend('response_time_ingredients', true);
const errorRate = new Rate('error_rate');

export const options = {
    thresholds: {
        'response_time_categories': ['p(95)<200'],
        'response_time_cuisines': ['p(95)<200'],
        'response_time_ingredients': ['p(95)<200'],
        'error_rate': ['rate<0.05'],
    },
    stages: [
        { duration: '0.5m', target: 100 },
        { duration: '0.5m', target: 0 },
    ],
};

export default function () {
    const baseURL = 'http://host.docker.internal:8060/internal/v1';

    const responses = {
        categories: http.get(`${baseURL}/get-categories`),
        cuisines: http.get(`${baseURL}/get-cuisines`),
        ingredients: http.get(`${baseURL}/get-ingredients`),
    };

    Object.entries(responses).forEach(([key, res]) => {
        responseTimes[key].add(res.timings.duration);
        checkResponse(res, key, key);
        sleep(0.5);
    });

    sleep(1);
}

function checkResponse(res, endpointName, key) {
    const isResponsePresent = res.body && res.body.length > 0;
    const isSuccess = check(res, {
        [`${endpointName}: status 200`]: (r) => r.status === 200,
        [`${endpointName}: response time < 400ms`]: (r) => r.timings.duration < 400,
        [`${endpointName}: type content application/json`]: (r) => r.headers['Content-Type'] === 'application/json',
        [`${endpointName}: body is not empty`]: () => isResponsePresent,
    });

    if (isResponsePresent) {
        checkStructure(res, endpointName, key);
    } else {
        errorRate.add(1);
        console.error(`Request body ${endpointName} is empty or absent.`);
    }

    if (!isSuccess) {
        errorRate.add(1);
        console.error(`Error during request ${endpointName}: status ${res.status}, body: ${res.body}`);
    }
}

function checkStructure(res, endpointName, expectedKey) {
    try {
        const jsonBody = JSON.parse(res.body);
        check(jsonBody, {
            [`${endpointName}: correct struct`]: (jb) => jb && jb.hasOwnProperty(expectedKey),
        });
    } catch (e) {
        errorRate.add(1);
        console.error(`Error parsing JSON for ${endpointName}: ${e.message}`);
    }
}
