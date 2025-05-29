console.log('Контентный скрипт запущен');

const banner = document.createElement('div');
banner.textContent = 'Вставлено расширением!';
banner.style.position = 'fixed';
banner.style.bottom = '0';
banner.style.left = '0';
banner.style.right = '0';
banner.style.background = 'red';
banner.style.color = 'white';
banner.style.textAlign = 'center';
banner.style.padding = '10px';
document.body.appendChild(banner);
