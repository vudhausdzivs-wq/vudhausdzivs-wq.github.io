document.addEventListener('DOMContentLoaded', function() {
    console.log('Скрипт загружен'); // Проверка что скрипт работает

    // Копирование промокодов
    const copyButtons = document.querySelectorAll('.copy-btn');
    console.log('Найдено кнопок:', copyButtons.length);

    copyButtons.forEach(button => {
        button.addEventListener('click', async function(e) {
            e.preventDefault();
            
            // Находим текст промокода
            const item = this.closest('.promotional-codes-item');
            const promoText = item.querySelector('.promotional-codes-text').innerText;
            console.log('Копируем:', promoText);

            try {
                await navigator.clipboard.writeText(promoText);
                const originalText = this.textContent;
                this.textContent = '✓ Скопировано!';
                this.classList.add('copied');

                setTimeout(() => {
                    this.textContent = originalText;
                    this.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Ошибка:', err);
                this.textContent = '❌ Ошибка';
                setTimeout(() => {
                    this.textContent = 'Копировать';
                }, 1500);
            }
        });
    });

    // Закрытие бургер-меню
    const burgerToggle = document.getElementById('burger-toggle');
    const navLinks = document.querySelectorAll('.nav-link');

    if (burgerToggle) {
        console.log('Бургер найден');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (burgerToggle.checked) {
                    burgerToggle.checked = false;
                    console.log('Меню закрыто');
                }
            });
        });
    } else {
        console.log('Бургер не найден');
    }
});