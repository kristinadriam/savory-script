import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import RecipeSandbox from './screens/RecipeSandbox/RecipeSandbox';
import RecipesHome from './screens/RecipesHome/RecipesHome';
import Header from './components/Header';


const App = () => {
  const [activeComponent, setActiveComponent] = useState('all');
  const [subtitle, setSubtitle] = useState('[ Recipes Home ]');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'create':
        return <RecipeSandbox
          onClickCreate={() => {
            setActiveComponent('create')
            setSubtitle('[ Recipes Sandbox ]')
          }}
          onClickAll={() => {
            setActiveComponent('all')
            setSubtitle('[ Recipes Home ]')
          }}
        />;
      case 'all':
        return <RecipesHome
          onClickSandbox={() => {
            setActiveComponent('create')
            setSubtitle('[ Recipes Sandbox ]')
          }
          }
          onClickHome={() => {
            setActiveComponent('all')
            setSubtitle('[ Recipes Home ]')
          }} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.app}>
      <Header
        name="Savory script"
        title="Your magical assistant in the world of cooking."
        subtitle={subtitle}
      />
      {renderComponent()}
    </View>
  );
};

const styles = StyleSheet.create({
  app: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
  },
});

export default App;