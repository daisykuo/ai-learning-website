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
        background: linear-gradient(135deg, #4fd843, #ffde59);
        color: white;
        border: none;
        border-radius: 20px;
        font-weight: bold;
    }
    .stButton button:hover {
        transform: scale(1.05);
    }
</style>
""", unsafe_allow_html=True)

# ===== 2. 處理 API Key (關鍵步驟) =====
# Streamlit Cloud 不會讓你上傳 .env 檔，而是要在網頁後台設定 Secrets
# 這裡的邏輯是：先嘗試讀取 Secrets，如果沒有，就請使用者輸入
api_key = None

try:
    # 這是雲端部署時最重要的一行，它會去讀取你在 Streamlit Cloud 設定的密鑰
    api_key = st.secrets["GROQ_API_KEY"]
except:
    # 如果在本機執行或是雲端沒設定好，側邊欄會出現輸入框當作備案
    with st.sidebar:
        st.warning("⚠️ 未偵測到雲端金鑰")
        api_key = st.text_input("請輸入 Groq API Key", type="password")

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

# 設定角色
system_writer = "你是一位充滿創意的作家，請用繁體中文，將使用者的主題寫成一篇約 200 字的短篇故事，風格生動有趣。"
system_reviewer = "你是一位嚴格的國文老師，請用繁體中文，針對這篇文章給出 3 點具體改進建議（例如修辭、邏輯、用詞）。"

# ===== 4. 網頁介面 =====
st.title("🤖 AI 寫作實驗室")
st.markdown("### 這裡展示 AI 如何像人類一樣思考與修改文章")

# 輸入區
col1, col2 = st.columns([1, 1.5])

with col1:
    st.info("👇 第一步：給 AI 一個題目")
    user_topic = st.text_area("請輸入主題", height=150, placeholder="例如：一隻想飛上太空的企鵝...")
    
    # 按鈕
    if st.button("開始 AI 協作流程 🚀", use_container_width=True):
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
            with st.spinner('AI 考生正在努力寫作...'):
                draft = get_ai_response(client, system_writer, user_topic)
                my_bar.progress(33, text="初稿完成！正在交給老師批改...")

            # Step 2: 老師批改
            with st.spinner('AI 老師正在閱卷...'):
                feedback = get_ai_response(client, system_reviewer, draft)
                my_bar.progress(66, text="批改完成！正在進行最終修訂...")

            # Step 3: 最終修訂
            with st.spinner('AI 考生正在根據建議重寫...'):
                rewrite_prompt = f"這是初稿：\n{draft}\n\n這是老師建議：\n{feedback}\n\n請根據建議重新潤飾文章。"
                final_version = get_ai_response(client, system_writer, rewrite_prompt)
                my_bar.progress(100, text="大功告成！")

            # 儲存結果到 session state 以便顯示 (防止重新整理消失)
            st.session_state['result'] = {
                'draft': draft,
                'feedback': feedback,
                'final': final_version
            }

with col2:
    st.info("👀 第二步：觀察 AI 的互動")
    
    if 'result' in st.session_state:
        res = st.session_state['result']
        
        tab1, tab2, tab3 = st.tabs(["📄 初稿 (Draft)", "🧐 老師建議 (Feedback)", "✨ 完稿 (Final)"])
        
        with tab1:
            st.text_area("考生第一次寫的", value=res['draft'], height=300)
        
        with tab2:
            st.warning("老師給的建議")
            st.write(res['feedback'])
            
        with tab3:
            st.success("最終修改版本")
            st.markdown(res['final'])
    else:
        st.write("👈 請在左邊輸入主題並按下開始按鈕，結果會顯示在這裡！")
