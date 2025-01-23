import React, { useState } from 'react';

export const CustomMultiSelectExample = () => {
  const users = Array.from({ length: 1000 }, (_, index) => ({
    value: `${index + 1}`,
    label: `User ${index + 1}`,
  }));

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions);
    const values = selectedOptions.map(option => option.value);

    setSelectedUsers(prevSelectedUsers => {
      // Создать Set для управления уникальными значениями
      const updatedSelection = new Set(prevSelectedUsers);

      // Обработать значения: добавить, если нет, иначе удалить
      values.forEach(value => {
        if (updatedSelection.has(value)) {
          updatedSelection.delete(value); // Удалить, если уже было
        } else {
          updatedSelection.add(value); // Добавить, если не было
        }
      });

      return Array.from(updatedSelection); // Вернуть как массив
    });
  };


  const sortedUsers = [
    ...users.filter(user => selectedUsers.includes(user.value)),
    ...users.filter(user => !selectedUsers.includes(user.value)),
  ];

  return (
    <div style={{ width: '300px', margin: '0 auto', padding: '20px' }}>
      <h3>User Selection</h3>
      <select
        multiple
        value={selectedUsers}
        onChange={handleSelectChange}
        style={{ width: '100%', height: '200px' }}
      >
        {sortedUsers.map(user => (
          <option key={user.value} value={user.value}>
            {user.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CustomMultiSelectExample;