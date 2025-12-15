import streamlit as st
from groq import Groq
import os

# ===== 1. 雲端環境設定 =====
st.set_page_config(
    page_title="AI 寫作實作區",
    layout="wide"
)

# 自訂 CSS，讓它看起來跟你的 HTML 網站風格一致
st.markdown("""
<style>
    .stApp { background-color: #f0a844; }
    h1 { color: #ff914d; }
    .stButton button {
        background: #56beff;
        color: white;
        border: none;
        border-radius: 20px;
        font-weight: bold;
        transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    }
    .stButton button:hover {
        transform: translateY(-3px) scale(1.05);
        box-shadow: 0 6px 10px black;
    }
    .st.write {
        background: #fae86b;
        color: black;
        border-radius: 20px;
    }
    .st.tabs:hover {
        color: white;
        font-weight: bold;
    }
    .st.info{
        background-color: #56beff;
        opacity: 0.8;
        color: #ff914d!important;
    }
    /* 側邊欄樣式優化 */
    section[data-testid="stSidebar"] {
        background-color: black;
        color: #ff914d;
    }
</style>
""", unsafe_allow_html=True)

with st.sidebar:
    st.header("角色設定")
    # ===== 2. 處理 API Key (關鍵步驟) =====
    # 這裡的邏輯是：先嘗試讀取 Secrets，如果沒有，就請使用者輸入
    api_key = None

    try:
        api_key = st.secrets["GROQ_API_KEY"]
    except:
        st.warning("未偵測到雲端金鑰")
        api_key = st.text_input("請輸入 Groq API Key", type="password")
    st.markdown("---") # 分隔線
    st.subheader("自訂 AI 角色")
    st.info("你可以嘗試修改下方的提示詞，創造出不同個性的 AI！")

    # 預設的提示詞
    default_writer_prompt = "你是一位充滿創意的作家，你擅長將故事中的景色描繪成閃閃發光、充滿希望的樣子，筆下的人物生動地彷彿就在眼前。請用繁體中文，將使用者的主題寫成一篇約 150 字的短篇故事。"
    default_reviewer_prompt = "你是一位國文老師，你喜歡詞藻華麗，喜歡給予角色一段不堪回首的過往，來塑造出角色的豐富度，請用繁體中文，針對這篇文章給出 3 點具體改進建議（例如修辭、邏輯、用詞）。"

    # 使用 text_area 讓使用者可以修改，並將結果存入變數
    system_writer = st.text_area("設定「AI 考生」或自訂的人設：", value=default_writer_prompt, height=150)
    system_reviewer = st.text_area("設定「AI 老師」或自訂的人設：", value=default_reviewer_prompt, height=150)

# ===== 3. AI 核心邏輯 (考生與考官) =====
def get_ai_response(client, role_prompt, user_input):
    try:
        completion = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {"role": "system", "content": role_prompt},
                {"role": "user", "content": user_input}
            ],
            temperature=0.7,
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"發生錯誤: {str(e)}"

# ===== 4. 網頁介面 =====
st.title("AI 寫作----AI代理設計模式")
st.markdown("### 你可以在側邊欄選擇預設/自訂角色，再輸入主題，並觀察 AI 如何學習")

# 輸入區
col1, col2 = st.columns([1, 1.5])

with col1:
    st.info("第一步：給 AI 一個題目")
    user_topic = st.text_area("請輸入主題", height=150, placeholder="例如：一隻想飛上太空的企鵝...")
    
    # 按鈕
    if st.button("開始 AI 協作流程", use_container_width=True):
        if not api_key:
            st.error("❌ 缺少 API Key，無法啟動 AI。")
        elif not user_topic:
            st.warning("❌ 請先輸入主題喔！")
        else:
            # 初始化 Groq 客戶端
            client = Groq(api_key=api_key)
            
            # 建立進度條
            progress_text = "AI 正在思考中..."
            my_bar = st.progress(0, text=progress_text)

            # Step 1: 考生寫作
            with st.spinner('正在努力寫作...'):
                draft = get_ai_response(client, system_writer, user_topic)
                my_bar.progress(33, text="初稿完成！準備進行校閱...")

            # Step 2: 老師批改
            with st.spinner('正在校閱...'):
                feedback = get_ai_response(client, system_reviewer, draft)
                my_bar.progress(66, text="批改完成！準備進行最終修訂...")

            # Step 3: 最終修訂
            with st.spinner('正在根據建議重寫...'):
                rewrite_prompt = f"這是初稿：\n{draft}\n\n這是校閱後：\n{feedback}\n\n請根據建議重新潤飾文章。"
                final_version = get_ai_response(client, system_writer, rewrite_prompt)
                my_bar.progress(100, text="大功告成！")

            # 儲存結果到 session state 以便顯示 (防止重新整理消失)
            st.session_state['result'] = {
                'draft': draft,
                'feedback': feedback,
                'final': final_version
            }

with col2:
    st.info("第二步：觀察 AI 的互動")
    
    if 'result' in st.session_state:
        res = st.session_state['result']
        
        tab1, tab2, tab3 = st.tabs(["初稿 (Draft)", "接收建議 (Feedback)", "修改後最終完稿 (Final)"])
        
        with tab1:
            st.write(res['draft'])
        
        with tab2:
            st.write(res['feedback'])
            
        with tab3:
            st.markdown(res['final'])
    else:
        st.write("👈 請在左邊輸入主題並按下開始按鈕，結果會顯示在這裡！")


