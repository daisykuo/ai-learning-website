//== 全域變數 =====
let currentTopic = null;
let currentPage = 0;
let totalPages = 0;
let chatInitialized = false;
// 程式會去數你有幾個 id 開頭是 "onboarding-" 的元素
const allOnboardingScreens = document.querySelectorAll('[id^="onboarding-"]');
const totalOnboarding = allOnboardingScreens.length;
let currentOnboarding = 1;

// ===== 學習內容資料（分頁版本） =====
const topicContents = {
    1: {
        title: '什麼是AI',
        icon: '💡',
        pages: [
            {
                content: `
                    <h2 style="color: #ff914d; margin-bottom: 30px;">什麼是AI（人工智慧）</h2>
                    
                    <div style="background: white; padding: 30px; border-radius: 20px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                        <h3 style="color: #56beff; margin-bottom: 20px;">簡單來說</h3>
                        <p style="font-size: 1.2em; line-height: 2;">
                            AI，也就是Artificial Intelligence 人工智慧，<strong>讓機器透過學習，模仿人類的思考方式與行為</strong>。<br>簡單來說，人類給機器很多資料，可以是關於醫學、科學、財務的專業知識，也可以是貓咪的照片、食譜等，而機器會透過這些資料學習，當你提出問題時機器便能根據訓練結果給出答案。<br><strong>AI是會學習、會判斷、能幫人做事的電腦程式</strong>，你可以把它當成日常生活的幫手、你的數學家教、寫程式的助手等。
                        </p>
                    </div>
                    <div style="background: linear-gradient(135deg, #56beff, #ffde59); padding: 30px; border-radius: 20px; color: white; text-align: center;">
                        <h3 style="margin-bottom: 15px; font-size: 1.5em;">生活中哪裡有AI呢？</h3>
                    </div>
                `   
            }
        ]
    },
    2: {
        title: 'AI可以做什麼？',
        pages: [
            {
                content: `
                    <h2 style="color: #ff914d; margin-bottom: 30px;">其實 AI 已經融入在我們的生活中：</h2>
                    
                    <div style="background: white; padding: 30px; border-radius: 20px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                        <h3 style="color: #56beff; margin-bottom: 20px;">個人化廣告</h3>
                        <p style="font-size: 1.2em; line-height: 2;">
                            網路購物時平台透過分析你的消費和瀏覽紀錄，找出你可能會喜歡的產品，並推薦給你一份特別為你打造的廣告。
                        </p>
                    </div>

                    <div style="background: white; padding: 30px; border-radius: 20px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                        <h3 style="color: #56beff; margin-bottom: 20px;">AI 查詢結果概述</h3>
                        <p style="font-size: 1.2em; line-height: 2;">
                            當你上網查詢時，搜尋結果出現了一欄概述，那是 AI 先看了符合搜尋關鍵字的資料，並幫你整理成一份簡單的報告，讓你能馬上掌握你要的結果。
                        </p>
                    </div>
                `
            },
            {
                content: `
                    <h2 style="color: #ff914d; margin-bottom: 30px;">AI 的創作能力</h2>
                    
                    <div style="background: white; padding: 30px; border-radius: 20px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                        <h3 style="color: #56beff; margin-bottom: 20px;">創作與設計</h3>
                        <ul style="list-style: none; padding: 0;">
                            <li style="padding: 15px; margin: 10px 0; background: #f0f9ff; border-radius: 15px;">
                                <strong>畫圖</strong> - 現在Gemini結合了Nano Banana，下一行指令便能生成高品質的圖片
                            </li>
                            <li style="padding: 15px; margin: 10px 0; background: #f0f9ff; border-radius: 15px;">
                                <strong>作曲</strong> - 只要說出你要的音樂風格、節奏等，你也可以創作出一首歌
                            </li>
                            <li style="padding: 15px; margin: 10px 0; background: #f0f9ff; border-radius: 15px;">
                                <strong>寫作</strong> - 不論是一篇醫學論文，還是一本奇幻小說，只要你想的到AI都寫得出來
                            </li>
                        </ul>
                    </div>

                    <div style="background: linear-gradient(135deg, #56beff, #ffde59); padding: 30px; border-radius: 20px; color: white; text-align: center;">
                        <h3 style="margin-bottom: 15px; font-size: 1.5em;">還有更多...</h3>
                        <p style="font-size: 1.2em; line-height: 2;">
                            雖然AI不能取代人類，但AI的能力正在不斷進步，未來還會有更多令人驚奇的功能！
                        </p>
                    </div>
                `
            }
        ]
    },

    3: {
        title: '如何使用AI',
        icon: '✨',
        pages: [
            {
                content: `
                    <h2 style="color: #ff914d; margin-bottom: 30px;">如何使用AI - 認識AI工具</h2>
                    
                    <div style="background: white; padding: 30px; border-radius: 20px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                        <h3 style="color: #56beff; margin-bottom: 20px;">步驟一：選擇AI工具</h3>
                        <p style="font-size: 1.2em; line-height: 2; margin-bottom: 15px;">
                            常見的AI聊天工具有：
                        </p>
                        <ul style="list-style: none; padding: 0;">
                            <li style="padding: 15px; margin: 10px 0; background: #fff9e6; border-radius: 15px;">
                                <strong>ChatGPT</strong> - 語言流暢自然，適合解決一般日常任務，也擅長創意和腦力激盪，不過可能過度自信地回答錯誤內容
                            </li>
                            <li style="padding: 15px; margin: 10px 0; background: #fff9e6; border-radius: 15px;">
                                <strong>Google Gemini</strong> - Google推出的AI助手，擅長生成圖片、音訊、影片，也與Google搜尋整合整理出AI概述，現在可說是最厲害的AI
                            </li>
                            <li style="padding: 15px; margin: 10px 0; background: #fff9e6; border-radius: 15px;">
                                <strong>Claude</strong> - 擅長處理長文本與複雜推理，你問一句，它會像你的秘書一樣上繳一份書面報告回答你
                            </li>
                            <li style="padding: 15px; margin: 10px 0; background: #fff9e6; border-radius: 15px;">
                                <strong>Copilot</strong> - 整合Microsoft Word、Excel、Teams，可以直接在Word文件中提出問題並幫你解決，不過其他功能上較差
                            </li>
                        </ul>
                    </div>
                `
            },
            {
                content: `
                    <h2 style="color: #ff914d; margin-bottom: 30px;">步驟二：如何對AI下指令</h2>
                    
                    <div style="background: white; padding: 30px; border-radius: 20px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                        <h3 style="color: #56beff; margin-bottom: 20px;">跟AI對話你必須知道</h3>
                        <ul style="list-style: none; padding: 0;">
                            <li style="padding: 15px; margin: 10px 0; background: #fff9e6; border-radius: 15px;">
                                <strong>清楚描述</strong> - 你問得愈詳細愈清楚，AI生成的結果會愈符合你的要求
                            </li>
                            <li style="padding: 15px; margin: 10px 0; background: #fff9e6; border-radius: 15px;">
                                <strong>可以追問</strong> - 如果不符合你的要求，可以再次詢問不斷調整直到達到理想
                            </li>
                            <li style="padding: 15px; margin: 10px 0; background: #fff9e6; border-radius: 15px;">
                                <strong>可能出錯</strong> - AI不是萬能的，仍然會提供錯誤的資訊，因此詢問醫療相關或是專業知識時，勿完全依賴AI，請務必多次查證內容正確與否
                            </li>
                            <li style="padding: 15px; margin: 10px 0; background: #fff9e6; border-radius: 15px;">
                                <strong>保護隱私</strong> - 千萬不要透露個人資料或密碼！你與AI的對話過程可能當成AI的訓練資料，假設提供公司內部不公開的財務狀況，AI有可能學習後提供給其他人
                            </li>
                        </ul>
                    </div>

                    <div style="background: #f0f9ff; padding: 20px; border-radius: 15px; margin: 15px 0;">
                        <p style="font-size: 1.1em; margin-bottom: 10px;"><strong>更進階的方式</strong></p>
                        <p style="padding-left: 20px; line-height: 2;"><strong>替AI設定一個角色：</strong>國中生的數學家教、教導大學生的美國教授、某個偶像或是總統等</p>
                        <p style="padding-left: 20px; line-height: 2;"><strong>給予範例：</strong>讓AI按照你所想的方式回答你，假設你要學習瑜珈，你可以丟一個動作的一系列步驟，請他照著這種方式一步步告訴你其他動作</p>
                        <p style="padding-left: 20px; line-height: 2;"><strong>嘗試不同AI：</strong>誰說只能問一個AI？你可以問多個AI同樣的問題，從中選擇你最喜歡的回答</p>
                    </div>
                `
            },
            {
                content: `
                    <h2 style="color: #ff914d; margin-bottom: 30px;">實際體驗 - 試著跟AI聊天</h2>
                    
                    <div style="background: white; padding: 30px; border-radius: 20px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                        <h3 style="color: #56beff; margin-bottom: 20px;">現在輪到你了！</h3>
                        <p style="font-size: 1.2em; line-height: 2; margin-bottom: 20px;">
                            下面提供前面所介紹的AI工具連結，請點擊按鈕去網站上試著輸入問題，看看AI如何回答：
                        </p>
                        <div style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: center;">
                            <a href="https://chatgpt.com/" target="_blank" style="text-decoration: none;">
                                <div style="padding: 15px 30px; background: #fff9e6; border-radius: 15px; color: #333; border: 2px solid #ffde59; transition: transform 0.2s;">
                                    <strong>ChatGPT</strong>
                                </div>
                            </a>

                            <a href="https://gemini.google.com/" target="_blank" style="text-decoration: none;">
                                <div style="padding: 15px 30px; background: #e6f7ff; border-radius: 15px; color: #333; border: 2px solid #ffde59; transition: transform 0.2s;">
                                    <strong>Gemini</strong>
                                </div>
                            </a>

                            <a href="https://claude.ai" target="_blank" style="text-decoration: none;">
                                <div style="padding: 15px 30px; background: #fff0e6; border-radius: 15px; color: #333; border: 2px solid #ffde59; transition: transform 0.2s;">
                                    <strong>Claude</strong>
                                </div>
                            </a>
                            
                            <a href="https://copilot.microsoft.com" target="_blank" style="text-decoration: none;">
                                <div style="padding: 15px 30px; background: #f0f0f0; border-radius: 15px; color: #333; border: 2px solid #ffde59; transition: transform 0.2s;">
                                    <strong>Copilot</strong>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div style="background: white; padding: 30px; border-radius: 20px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                        <h3 style="color: #56beff; margin-bottom: 20px;">進階！</h3>
                        <p style="font-size: 1.2em; line-height: 2; margin-bottom: 20px;">
                            來玩玩看吧！這裡設定了兩個角色，作家和老師，你可以隨意輸入主題，觀察 AI 如何像人類一樣思考與修改文章！
                        </p>
                        <button class="nav-button" onclick="window.open('YOUR_STREAMLIT_URL', '_blank')">
                            開啟 AI 實作練習
                        </button>
                    </div>
                    <div style="background: linear-gradient(135deg, #56beff, #ffde59); padding: 30px; border-radius: 20px; color: white; text-align: center; margin-top: 25px;">
                        <h3 style="margin-bottom: 15px; font-size: 1.5em;">恭喜你！</h3>
                        <p style="font-size: 1.2em; line-height: 2;">
                            你已經學會如何使用AI了！記得：不要怕犯錯，多練習就會越來越熟練！
                        </p>
                    </div>
                `
            }
        ]
    }
};
// ===== 3. 程式進入點 (確保網頁載入後才執行) =====
document.addEventListener('DOMContentLoaded', function() {
    console.log("網頁載入完成，開始初始化...");
    initializeApp();
});

// ===== 4. 初始化應用程式 =====
function initializeApp() {
    setupFontSizeControl();
    setupIntroModal();
    setupTopicButtons();
    
    // 綁定引導頁面點擊事件
    for (let i = 1; i <= totalOnboarding; i++) {
        const el = document.getElementById(`onboarding-${i}`);
        if (el) {
            el.onclick = function() {
                showNextOnboarding();
            };
        }
    }
}

// ===== 引導頁面控制 =====
function showNextOnboarding() {
    const current = document.getElementById(`onboarding-${currentOnboarding}`);
    if (!current) return;

    // 情況 A：還有下一頁
    if (currentOnboarding < totalOnboarding) {
        const next = document.getElementById(`onboarding-${currentOnboarding + 1}`);
        if (next) {
            // 文字進場動畫
            next.style.display = 'flex';
            next.classList.remove('fade-out');
            next.classList.add('slide-in');
        }
        // 隱藏當前文字 (背景不會動，只有文字消失)
        current.style.display = 'none';
        currentOnboarding++;
    } 
    // 情況 B：最後一頁，進入主網站
    else {
        // 1. 文字淡出
        current.classList.add('fade-out');
        
        // 2. ★★★ 讓共用背景也淡出 ★★★
        const bgLayer = document.getElementById('global-onboarding-bg');
        if (bgLayer) bgLayer.classList.add('fade-out');

        // 3. 顯示主網站
        const mainWebsite = document.getElementById('main-website');
        if (mainWebsite) {
            mainWebsite.style.opacity = '0';
            mainWebsite.classList.add('show');
            
            setTimeout(() => {
                current.style.display = 'none'; // 關閉引導文字
                if(bgLayer) bgLayer.style.display = 'none'; // 關閉背景層
                mainWebsite.style.opacity = '1';
                document.body.style.overflow = 'auto';
            }, 800); // 時間稍微拉長一點，讓轉場更優雅
        }
        currentOnboarding++;
    }
}

// ===== 網頁介紹彈窗 =====
function setupIntroModal() {
    const introBtn = document.getElementById('intro-btn');
    const modal = document.getElementById('intro-modal');
    const closeBtn = document.getElementById('close-modal');
    
    if (introBtn) introBtn.addEventListener('click', () => modal.classList.add('active'));
    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    if (modal) modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });
}
// ===== 字體大小控制 =====
function setupFontSizeControl() {
    const fontSmall = document.getElementById('font-small');
    const fontMedium = document.getElementById('font-medium');
    const fontLarge = document.getElementById('font-large');
    
    fontSmall.addEventListener('click', function() {
        setFontSize('small');
    });
    
    fontMedium.addEventListener('click', function() {
        setFontSize('medium');
    });
    
    fontLarge.addEventListener('click', function() {
        setFontSize('large');
    });
}

function setFontSize(size) {
    const body = document.body;
    const buttons = document.querySelectorAll('.size-btn');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    body.classList.remove('font-small', 'font-medium', 'font-large');
    body.classList.add('font-' + size);
    document.getElementById('font-' + size).classList.add('active');
}
function setupTopicButtons() {
    document.querySelectorAll('.topic-button').forEach(button => {
        button.addEventListener('click', function() {
            const topicNum = this.getAttribute('data-topic');
            loadTopic(topicNum);
        });
    });
}
// ===== 載入主題內容 =====
function loadTopic(topicNum) {
    
    setTimeout(function() {
        currentTopic = topicNum;
        currentPage = 0;
        const topic = topicContents[topicNum];
        totalPages = topic.pages.length;

        document.querySelector('.topics-section').style.display = 'none';
        
        const contentSection = document.getElementById('content-section');
        const contentArea = document.getElementById('content-area');
        
        let pagesHTML = '';
        topic.pages.forEach((page, index) => {
            pagesHTML += `
                <div class="page-content ${index === 0 ? 'active' : ''}" data-page="${index}">
                    ${page.content}
                </div>
            `;
        });
        
        const navigationHTML = `
            <div class="page-navigation">
                <button class="page-nav-btn" id="prev-btn" onclick="previousPage()">上一頁</button>
                <div class="page-indicator" id="page-indicator"></div>
                <button class="page-nav-btn" id="next-btn" onclick="nextPage()">下一頁</button>
            </div>
        `;
        
        contentArea.innerHTML = pagesHTML + navigationHTML;
        contentSection.style.display = 'block';
        
        updatePageIndicator();
        updateNavigationButtons();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    }, 800); // 這裡的 800 是模擬讀取時間
}
// ===== 下一頁 =====
function nextPage() {
    // 如果是最後一頁，返回主選單
    if (currentPage === totalPages - 1) {
        returnToMainMenu();
        return;
    }
    if (currentPage < totalPages - 1) {
        
        setTimeout(() => {
            document.querySelector(`.page-content[data-page="${currentPage}"]`).classList.remove('active');
            currentPage++;
            document.querySelector(`.page-content[data-page="${currentPage}"]`).classList.add('active');
            
            updatePageIndicator();
            updateNavigationButtons();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            if (currentTopic == 4 && currentPage === 2) {
                setTimeout(initChatFeature, 300);
            }
        }, 600);
    }
}

// ===== 上一頁 =====
function previousPage() {
    if (currentPage > 0) {        
        setTimeout(() => {
            document.querySelector(`.page-content[data-page="${currentPage}"]`).classList.remove('active');
            currentPage--;
            document.querySelector(`.page-content[data-page="${currentPage}"]`).classList.add('active');
            
            updatePageIndicator();
            updateNavigationButtons();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 600);
    }
}
// ===== 返回主選單 =====
function returnToMainMenu() {
    
    setTimeout(function() {
        currentTopic = null;
        currentPage = 0;
        totalPages = 0;
        chatInitialized = false;
        
        document.getElementById('content-section').style.display = 'none';
        document.querySelector('.topics-section').style.display = 'block';
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);   
}
// 大更新的新增
function updatePageIndicator() {
    const indicator = document.getElementById('page-indicator');
    let dotsHTML = '';
    for (let i = 0; i < totalPages; i++) {
        dotsHTML += `<div class="page-dot ${i === currentPage ? 'active' : ''}"></div>`;
    }
    indicator.innerHTML = dotsHTML;
}
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    prevBtn.disabled = (currentPage === 0);
    
    if (currentPage === totalPages - 1) {
        nextBtn.textContent = '返回主選單';
        nextBtn.disabled = false;
    } else {
        nextBtn.textContent = '下一頁';
        nextBtn.disabled = false;
    }
}

