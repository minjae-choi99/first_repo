// --- 오디오 효과음 제너레이터 (편안하고 차분한 하프/벨 사운드로 튜닝) ---
        let audioCtx = null;

        function initAudio() {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
        }

        // 극도로 연하고 부드러운 톤 (벨 / 맑은 수면 아래 잔물결 소리)
        function playGentleSound(freq, duration, type = 'sine') {
            try {
                initAudio();
                if (!audioCtx) return;

                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();

                osc.type = type;
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                // 주파수를 서서히 흘러내리게 하여 편안하고 따뜻한 잔향 연출
                osc.frequency.linearRampToValueAtTime(freq * 0.95, audioCtx.currentTime + duration);

                // 어택 음을 부드럽게 감쇄
                gain.gain.setValueAtTime(0, audioCtx.currentTime);
                gain.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 0.05); // 아주 작고 연한 볼륨
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.start();
                osc.stop(audioCtx.currentTime + duration);
            } catch (e) {
                console.log("Audio play blocked.");
            }
        }

        // 오도독 삼키는 소리 (맑고 마일드한 원목 실로폰 소리)
        function playMildChopSound() {
            playGentleSound(280, 0.25, 'sine');
            setTimeout(() => {
                playGentleSound(350, 0.3, 'sine');
            }, 120);
        }

        // 온기 전달 터치음 (잔잔한 물방울 떨어지는 맑은 소리)
        function playWarmthSound() {
            playGentleSound(440, 0.4); // A4
            setTimeout(() => {
                playGentleSound(554.37, 0.5); // C#5
            }, 100);
        }

        // 충전 완충 사운드 (몽환적이고 따뜻한 윈드차임 상승음)
        function playTherapySound() {
            const freqs = [349.23, 392.00, 440.00, 523.25, 587.33]; // F G A C D (동양적 오음계)
            freqs.forEach((freq, idx) => {
                setTimeout(() => {
                    playGentleSound(freq, 0.6);
                }, idx * 150);
            });
        }

        // --- 온기 전달 좋아요 기능 ---
        let likes = 128;
        function likeHongsi() {
            likes++;
            document.getElementById('like-count').innerText = likes;
            playWarmthSound();
            createHeartParticle();
        }

        function createHeartParticle() {
            const btn = document.querySelector('button[onclick="likeHongsi()"]');
            const rect = btn.getBoundingClientRect();
            const particle = document.createElement('div');
            // 하트 대신 은은한 숲속 잎새들
            particle.innerHTML = ['🌿', '✨', '💚'][Math.floor(Math.random() * 3)];
            particle.style.position = 'fixed';
            particle.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 60}px`;
            particle.style.top = `${rect.top}px`;
            particle.style.fontSize = '18px';
            particle.style.pointerEvents = 'none';
            particle.style.transition = 'all 1.2s ease-out';
            particle.style.zIndex = '9999';
            document.body.appendChild(particle);

            setTimeout(() => {
                particle.style.transform = 'translateY(-80px) scale(1.2) rotate(45deg)';
                particle.style.opacity = '0';
            }, 10);

            setTimeout(() => {
                particle.remove();
            }, 1200);
        }

        // --- 3단계 다이어트 비포/애프터 드래그 슬라이더 로직 ---
        function handleSliderDrag(value) {
            const afterClip = document.getElementById('diet-after-clip');
            const handle = document.getElementById('slider-handle');
            
            // clip-path: inset(top right bottom left) 방식으로 드래그 비율에 따라 가려질 면적 연산
            afterClip.style.clipPath = `inset(0 0 0 ${value}%)`;
            handle.style.left = `${value}%`;
            
            // 살짝 촉각적인 느낌을 제공하는 가벼운 사운드
            if (parseInt(value) % 10 === 0) {
                playGentleSound(180 + (parseInt(value) * 1.5), 0.05);
            }
        }

        // --- 4단계 눈빛 힐링 게이지 채우기 로직 ---
        let healingProgress = 30;
        function chargeHealing() {
            if (healingProgress >= 100) {
                healingProgress = 0;
            }
            healingProgress += 10;
            if (healingProgress > 100) healingProgress = 100;

            const gauge = document.getElementById('eye-gauge');
            const text = document.getElementById('eye-gauge-text');
            gauge.style.width = `${healingProgress}%`;
            text.innerText = `평온 지수 ${healingProgress}%`;

            if (healingProgress === 100) {
                text.innerText = `마음에 평화가 가득 찼습니다 🌿`;
                playTherapySound();
                for(let i = 0; i < 12; i++) {
                    setTimeout(spawnLeafParticle, i * 70);
                }
            } else {
                playGentleSound(350 + (healingProgress * 1.5), 0.25);
            }
        }

        function spawnLeafParticle() {
            const leaf = document.createElement('div');
            leaf.innerHTML = ['🌿', '🍃', '✨', '🤍'][Math.floor(Math.random() * 4)];
            leaf.style.position = 'fixed';
            leaf.style.left = `${Math.random() * window.innerWidth}px`;
            leaf.style.top = `${window.innerHeight}px`;
            leaf.style.fontSize = '24px';
            leaf.style.pointerEvents = 'none';
            leaf.style.transition = 'all 2s ease-out';
            leaf.style.zIndex = '9999';
            document.body.appendChild(leaf);

            setTimeout(() => {
                leaf.style.transform = `translateY(-${window.innerHeight + 100}px) rotate(${Math.random() * 180}deg)`;
                leaf.style.opacity = '0';
            }, 10);

            setTimeout(() => {
                leaf.remove();
            }, 2000);
        }

        // --- 5단계 간식 던지기 게임 로직 ---
        let satiety = 20;
        let isThrowing = false;
        function throwSnack() {
            if (isThrowing) return;
            isThrowing = true;
            const bone = document.getElementById('flying-bone');
            const bubble = document.getElementById('game-bubble');
            const satietyBar = document.getElementById('satiety-bar');
            const satietyText = document.getElementById('satiety-text');
            const defaultEyes = document.getElementById('eyes-default');
            const happyEyes = document.getElementById('eyes-happy');

            bone.style.opacity = '1';
            bone.style.transform = 'translate(130px, -90px) rotate(180deg)';
            playGentleSound(200, 0.4);

            setTimeout(() => {
                bone.style.opacity = '0';
                playMildChopSound();
                defaultEyes.classList.add('hidden');
                happyEyes.classList.remove('hidden');
                bubble.style.opacity = '1';
                satiety += 10;
                if (satiety > 100) satiety = 100;
                satietyBar.style.width = `${satiety}%`;
                satietyText.innerText = `${satiety}%`;
            }, 450);

            setTimeout(() => {
                bone.style.transform = 'translate(0px, 0px) rotate(0deg)';
                happyEyes.classList.add('hidden');
                defaultEyes.classList.remove('hidden');
                bubble.style.opacity = '0';
                isThrowing = false;
            }, 1800);
        }

        // 기본 안부 메시지 템플릿
        const DEFAULT_COMMENTS = [
            {
                nickname: "들길 견주",
                snack: "🌼 향긋한 캐모마일",
                comment: "가만히 있어도 쉼을 주는 눈빛이네요. 홍시의 매일에 가뿐하고 맑은 바람만 가득하길 바랍니다.",
                time: "어제 하루"
            },
            {
                nickname: "이웃집 지선",
                snack: "🍊 감 말랭이 차",
                comment: "포슬포슬한 몸에 품은 눈방울이 꼭 작은 구슬 같아서 보고만 있어도 복잡했던 하루가 조용해져요.",
                time: "어제 하루"
            }
        ];

        // 브라우저 로컬 저장소에서 데이터 인출
        function getStoredComments() {
            const stored = localStorage.getItem('hongsi_comments');
            if (stored) {
                return JSON.parse(stored);
            }
            localStorage.setItem('hongsi_comments', JSON.stringify(DEFAULT_COMMENTS));
            return DEFAULT_COMMENTS;
        }

        function renderComments() {
            const container = document.getElementById('comments-container');
            const comments = getStoredComments();
            container.innerHTML = ''; 

            comments.forEach(comment => {
                const colors = ['#FAF6F0', '#F2EFE9', '#F1EDE6'];
                const chosenColor = colors[Math.floor(Math.random() * colors.length)];
                
                const commentCard = document.createElement('div');
                commentCard.className = `border border-healing-sand p-6 rounded-xl organic-shadow-sm flex flex-col justify-between transition-all duration-300 hover:scale-[1.01]`;
                commentCard.style.backgroundColor = chosenColor;

                commentCard.innerHTML = `
                    <div>
                        <div class="flex justify-between items-center mb-3 text-xs">
                            <span class="font-bold text-healing-wood font-editorial">🌿 ${escapeHTML(comment.nickname)}</span>
                            <span class="bg-white text-healing-forest px-2.5 py-0.5 rounded border border-healing-sand/50 text-[10px]">${escapeHTML(comment.snack)}</span>
                        </div>
                        <p class="text-sm leading-relaxed text-healing-wood/80 font-serif">"${escapeHTML(comment.comment)}"</p>
                    </div>
                    <p class="text-[10px] text-healing-wood/45 text-right mt-4">${escapeHTML(comment.time || "방금 전")}</p>
                `;
                container.appendChild(commentCard);
            });
        }

        function addComment(e) {
            e.preventDefault();

            const nicknameInput = document.getElementById('nickname');
            const commentInput = document.getElementById('comment');
            const giftSnackSelect = document.getElementById('gift-snack');

            const nickname = nicknameInput.value.trim();
            const comment = commentInput.value.trim();
            const snack = giftSnackSelect.value;

            if (!nickname || !comment) return;

            const newComment = {
                nickname: nickname,
                snack: snack,
                comment: comment,
                time: "방금 전"
            };

            const comments = getStoredComments();
            comments.unshift(newComment); 
            localStorage.setItem('hongsi_comments', JSON.stringify(comments));

            renderComments();

            nicknameInput.value = '';
            commentInput.value = '';
            
            const container = document.getElementById('comments-container');
            if (container.firstChild) {
                container.firstChild.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        function escapeHTML(str) {
            return str.replace(/[&<>'"]/g, 
                tag => ({
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    "'": '&#39;',
                    '"': '&quot;'
                }[tag] || tag)
            );
        }

        document.addEventListener('DOMContentLoaded', function () {
            // 현재 페이지 메뉴 자동 강조
            const currentPage = document.body.dataset.page;
            document.querySelectorAll('[data-nav-page]').forEach(function (link) {
                if (link.dataset.navPage === currentPage) {
                    link.setAttribute('aria-current', 'page');
                }
            });

            // 모바일 햄버거 메뉴
            const menuButton = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');
            if (menuButton && mobileMenu) {
                menuButton.addEventListener('click', function () {
                    const willOpen = mobileMenu.classList.contains('hidden');
                    mobileMenu.classList.toggle('hidden');
                    mobileMenu.classList.toggle('flex');
                    menuButton.setAttribute('aria-expanded', String(willOpen));
                    menuButton.setAttribute('aria-label', willOpen ? '메뉴 닫기' : '메뉴 열기');
                    menuButton.innerHTML = willOpen
                        ? '<i class="fa-solid fa-xmark"></i>'
                        : '<i class="fa-solid fa-bars-staggered"></i>';
                });
            }

            // 방명록 페이지에서만 댓글 렌더링
            if (document.getElementById('comments-container')) {
                renderComments();
            }
        });
