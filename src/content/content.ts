// content-script.ts
console.log('[MOCK EXTENSION] Content script is active');

// function overrideUserCard(
//   _userId: number,
//   newData: Partial<{ name: string; email: string }>
// ) {
//   const interval = setInterval(() => {
//     const cards = document.querySelectorAll('.card');

//     cards.forEach((card) => {
//       const nameEl = card.querySelector('h2');
//       const emailEl = Array.from(card.querySelectorAll('p')).find((el) =>
//         el.textContent?.includes('@')
//       );

//       if (nameEl?.textContent?.includes('Clementine Bauch')) {
//         // имя этого пользователя с id = 3
//         if (newData.name) nameEl.textContent = newData.name;
//         if (newData.email && emailEl)
//           emailEl.textContent = `📧 ${newData.email}`;
//         clearInterval(interval);
//       }
//     });
//   }, 0);
// }

// // Вызов с замоканными данными
// overrideUserCard(3, {
//   name: '🔮 Замоканный Юзер',
//   email: 'fake@email.com',
// });
