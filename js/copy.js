document.addEventListener('DOMContentLoaded', function() {
    console.log('Скрипт загружен');

    // ========== GOOGLE TABLES ==========
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyy_d42Rs4acaOU0z7JQq6bDF4ABqFqn35nqJYUVHQETve8soLvfkOLjT6agRHTUXQ5';

    // Загрузка данных из таблицы и обновление существующих карточек
    async function updatePromocodesFromSheet() {
        try {
            const response = await fetch(SCRIPT_URL);
            const data = await response.json();
            
            // Берём все существующие карточки на странице
            const cards = document.querySelectorAll('.promotional-codes-item');
            
            data.promocodes.forEach((promo, index) => {
                if (cards[index]) {
                    // Обновляем текст промокода
                    const promoText = cards[index].querySelector('.promotional-codes-text');
                    if (promoText) promoText.textContent = promo.promocode;
                    
                    // Обновляем ссылку "В магазин"
                    const shopBtn = cards[index].querySelector('.shop-btn');
                    if (shopBtn) shopBtn.href = promo.link;
                    
                    // Обновляем data-атрибуты для статистики
                    const copyBtn = cards[index].querySelector('.copy-btn');
                    if (copyBtn) {
                        copyBtn.setAttribute('data-platform', promo.platform);
                        copyBtn.setAttribute('data-code', promo.promocode);
                    }
                    if (shopBtn) {
                        shopBtn.setAttribute('data-platform', promo.platform);
                    }
                }
            });
            
        } catch (error) {
            console.log('Ошибка загрузки промокодов:', error);
        }
    }

    // Отправка статистики
    async function sendStat(action, platform, promocode) {
        try {
            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify({
                    action: action,
                    platform: platform,
                    promocode: promocode,
                    userAgent: navigator.userAgent
                })
            });
        } catch (error) {
            console.log('Ошибка отправки статистики');
        }
    }

    // Копирование с отправкой статистики
    async function copyWithStatHandler(e) {
        const btn = e.currentTarget;
        const platform = btn.getAttribute('data-platform');
        const promocode = btn.getAttribute('data-code');
        
        if (!promocode) return;
        
        try {
            await navigator.clipboard.writeText(promocode);
            await sendStat('copy', platform, promocode);
            
            const originalText = btn.textContent;
            btn.textContent = '✓ Скопировано!';
            btn.classList.add('copied');
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.classList.remove('copied');
            }, 2000);
        } catch (err) {
            console.error('Ошибка:', err);
            btn.textContent = '❌ Ошибка';
            setTimeout(() => {
                btn.textContent = 'Копировать промокод';
            }, 1500);
        }
    }

    // Переход в магазин с отправкой статистики
    async function shopHandler(e) {
        const btn = e.currentTarget;
        const platform = btn.getAttribute('data-platform');
        const promoCode = btn.closest('.promotional-codes-item').querySelector('.promotional-codes-text')?.textContent || '';
        await sendStat('shop', platform, promoCode);
    }

    function attachCopyHandlers() {
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.removeEventListener('click', copyWithStatHandler);
            btn.addEventListener('click', copyWithStatHandler);
        });
    }

    function attachShopHandlers() {
        document.querySelectorAll('.shop-btn').forEach(btn => {
            btn.removeEventListener('click', shopHandler);
            btn.addEventListener('click', shopHandler);
        });
    }

    async function sendPageView() {
        await sendStat('page_view', 'all', '');
    }

    // Обновляем промокоды из таблицы
    updatePromocodesFromSheet();
    attachCopyHandlers();
    attachShopHandlers();
    sendPageView();

    // ========== БУРГЕР-МЕНЮ ==========
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