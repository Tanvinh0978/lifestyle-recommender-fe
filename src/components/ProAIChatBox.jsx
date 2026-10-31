import React, { useState, useRef, useEffect } from 'react';

const TOPIC_KEYWORDS = {
  fashion: ['mặc', 'áo', 'quần', 'váy', 'giày', 'phối', 'outfit', 'stylist', 'thời trang', 'màu', 'tone', 'phụ kiện', 'túi', 'lookbook', 'size', 'vest', 'blazer', 'set đồ', 'dáng'],
  nutrition: ['ăn', 'thực đơn', 'bữa', 'calo', 'calo', 'protein', 'đạm', 'carb', 'chất béo', 'fat', 'dinh dưỡng', 'eat clean', 'cơm', 'uống', 'nước', 'chế độ ăn', 'giảm cân', 'tăng cân', 'giảm mỡ', 'siết mỡ'],
  fitness: ['tập', 'bài tập', 'squat', 'push up', 'chống đẩy', 'cardio', 'hiit', 'cơ', 'gym', 'pilates', 'yoga', 'luyện tập', 'tạ', 'chạy bộ', 'bụng', 'mông', 'thể dục', 'pt'],
  about: ['web', 'website', 'wearwell', 'là gì', 'giới thiệu', 'tính năng', 'hướng dẫn', 'dùng thế nào', 'app']
};

function classifyMessage(text) {
  const clean = text.toLowerCase();
  
  if (TOPIC_KEYWORDS.about.some(k => clean.includes(k))) return 'about';
  if (TOPIC_KEYWORDS.fashion.some(k => clean.includes(k))) return 'fashion';
  if (TOPIC_KEYWORDS.nutrition.some(k => clean.includes(k))) return 'nutrition';
  if (TOPIC_KEYWORDS.fitness.some(k => clean.includes(k))) return 'fitness';
  
  return 'unrelated';
}

export default function ProAIChatBox({ user, wardrobe = [], onTriggerToast, initialContext = 'all' }) {
  const [messages, setMessages] = useState([
    {
      id: 'm_welcome',
      sender: 'ai',
      text: `Xin chào **${user?.name || 'bạn'}**! 👑 Tôi là Trợ lý AI Chuyên Sâu độc quyền dành riêng cho thành viên **Wearwell PRO VIP**.\n\nTôi sẵn sàng tư vấn trực tiếp 1-1 cho bạn về 3 lĩnh vực:\n1. 🪄 **Phối đồ Stylist AI** (theo tủ đồ & thời tiết ${user?.city || 'Hà Nội'})\n2. 🥗 **Thực đơn dinh dưỡng 4 bữa** (chuẩn Macro & TDEE)\n3. 🏋️ **Lịch tập luyện thể hình tại nhà**\n\nBạn có thể hỏi tự do hoặc chọn nhanh các gợi ý bên dưới nhé!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const topic = classifyMessage(query);

    await new Promise(r => setTimeout(r, 650));
    setIsTyping(false);

    let aiReplyText = '';

    if (topic === 'unrelated') {
      aiReplyText = `⚠️ **Nội dung không phù hợp với phạm vi hỗ trợ của Wearwell!**\n\nXin lỗi bạn, tôi là AI chuyên trách về **Phối đồ thời trang (Stylist)**, **Thực đơn dinh dưỡng** và **Kế hoạch tập luyện thể hình**.\n\nCâu hỏi của bạn không liên quan đến 3 lĩnh vực trên. Vui lòng đặt câu hỏi về phong cách ăn mặc, chế độ ăn hoặc tập luyện để tôi hỗ trợ bạn tốt nhất! ✨`;
    } else if (topic === 'about') {
      aiReplyText = `🌟 **GIỚI THIỆU VỀ NỀN TẢNG WEARWELL**\n\n**Wearwell** là trợ lý phong cách sống số toàn diện (Lifestyle Concierge):\n- 🪄 **Stylist AI**: Tự động so khớp các món đồ bạn sở hữu trong Tủ Đồ Số với thời tiết thực tế tại **${user?.city || 'Hà Nội'}** để tạo bản phối chuẩn tạp chí.\n- 🥗 **Dinh dưỡng cá nhân hóa**: Lên thực đơn 4 bữa thuần Việt bám sát chỉ số TDEE & mục tiêu **${user?.healthGoal === 'fat_loss' ? 'Giảm mỡ' : 'Tăng cơ'}** của bạn.\n- 🏋️ **Giáo án tại nhà**: Luyện tập tương tác có thanh tiến độ và hướng dẫn động tác chuẩn y khoa.\n- 👑 **Đặc quyền VIP**: Trò chuyện trực tiếp 1-1 không giới hạn với AI trong khung chatbox này!`;
    } else if (topic === 'fashion') {
      const wardrobeSample = wardrobe.length > 0 ? wardrobe.slice(0, 3).map(i => i.name).join(', ') : 'Sơ mi lụa, Quần âu';
      aiReplyText = `🪄 **TƯ VẤN STYLIST CHUYÊN SÂU CHO BẠN:**\n\nĐối với thời tiết tại **${user?.city || 'Hà Nội'}** và thể trạng **${user?.height || 163}cm / ${user?.weight || 51}kg** của bạn:\n- **Gợi ý phối:** Hãy kết hợp tone màu tương phản nhẹ (ví dụ: Áo sáng màu sơ vin vạt trước với quần ống suông cạp cao) để tạo tỷ lệ chân dài hơn.\n- **Tủ đồ hiện có:** Bạn có thể mix ngay từ tủ đồ của mình (${wardrobeSample}).\n- **Mẹo phụ kiện:** Thêm 1 chiếc thắt lưng da bản nhỏ 2cm hoặc đồng hồ dây da để tạo điểm nhấn sang trọng!`;
    } else if (topic === 'nutrition') {
      aiReplyText = `🥗 **TƯ VẤN THỰC ĐƠN & DINH DƯỠNG:**\n\nVới thể trạng **${user?.weight || 51}kg** và mục tiêu **${user?.healthGoal === 'fat_loss' ? 'Giảm mỡ siết cơ' : 'Duy trì vóc dáng'}**:\n- **Lượng nước khuyến nghị:** ${(user?.weight ? user.weight * 40 : 2100) / 1000} Lít/ngày.\n- **Bữa trưa lý tưởng:** 100g ức gà áp chảo sốt mè + 1 chén cơm lứt + rau xanh luộc (khoảng 450 kcal, 32g Protein).\n- **Bữa tối:** Hạn chế tinh bột nhanh sau 19:30, ưu tiên đạm dễ tiêu hóa như cá thu hoặc đậu hũ non.`;
    } else if (topic === 'fitness') {
      aiReplyText = `🏋️ **TƯ VẤN BÀI TẬP TẠI NHÀ:**\n\nGiáo án nhanh 25 phút hôm nay không cần tạ:\n1. **Bodyweight Squats**: 4 hiệp x 15 lần (nghỉ 45s) - Siết đùi và mông.\n2. **Plank Core Hold**: 3 hiệp x 45 giây - Giữ thắt lưng thẳng, siết chặt cơ bụng.\n3. **Glute Bridge**: 4 hiệp x 15 lần - Đẩy hông cao siết eo.\n\n*Nhớ uống 200ml nước ấm trước khi tập để tránh chuột rút bạn nhé!*`;
    }

    setMessages(prev => [
      ...prev,
      {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: aiReplyText,
        isWarning: topic === 'unrelated',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleQuickAction = (prompt) => {
    handleSend(prompt);
  };

  return (
    <div className="pro-chatbox-card-glass animate-fade-in-up">
      <div className="pro-chat-header">
        <div className="chat-avatar-status">
          <div className="vip-avatar-glow">👑</div>
          <div>
            <div className="chat-title-row">
              <h4>Wearwell AI Advisor</h4>
              <span className="badge-vip-live">PRO VIP 24/7</span>
            </div>
            <p className="chat-sub-hint">Trợ lý AI thời trang, thực đơn & thể lực trực tiếp theo hồ sơ ({user?.city || 'Hà Nội'})</p>
          </div>
        </div>

        <button
          type="button"
          className="btn-quick-about-pill"
          onClick={() => handleQuickAction('Giới thiệu sơ bộ về website Wearwell')}
        >
          ℹ️ Giới thiệu Wearwell
        </button>
      </div>

      {/* Quick Action Prompts Carousel */}
      <div className="chat-quick-actions-bar">
        <button type="button" className="quick-chip-btn" onClick={() => handleQuickAction(`Phối đồ đẹp hôm nay cho thời tiết tại ${user?.city || 'Hà Nội'}`)}>
          🪄 Gợi ý phối đồ hôm nay
        </button>
        <button type="button" className="quick-chip-btn" onClick={() => handleQuickAction('Lên thực đơn Eat Clean 4 bữa giảm mỡ cho tôi')}>
          🥗 Thực đơn Eat Clean hôm nay
        </button>
        <button type="button" className="quick-chip-btn" onClick={() => handleQuickAction('Gợi ý bài tập bụng và mông tại nhà 20 phút')}>
          🏋️ Bài tập tại nhà 20 phút
        </button>
        <button type="button" className="quick-chip-btn" onClick={() => handleQuickAction('Thời tiết hôm nay nên mặc chất liệu gì')}>
          🌤️ Tư vấn chất vải theo thời tiết
        </button>
      </div>

      {/* Messages Stream */}
      <div className="chat-messages-container">
        {messages.map((m) => (
          <div key={m.id} className={`chat-message-bubble ${m.sender} ${m.isWarning ? 'warning-bubble' : ''}`}>
            {m.sender === 'ai' && (
              <div className="msg-sender-badge">
                <span>{m.isWarning ? '⚠️ Wearwell Policy' : '✨ Stylist & PT AI'}</span>
                <span className="msg-time">{m.timestamp}</span>
              </div>
            )}
            <div className="msg-content-text">
              {m.text.split('\n').map((line, i) => (
                <p key={i} dangerouslySetInnerHTML={{
                  __html: line
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                }} />
              ))}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="chat-message-bubble ai typing">
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="chat-input-bar">
        <input
          type="text"
          className="chat-text-input"
          placeholder="Nhập câu hỏi về phối đồ, thực đơn calo hoặc bài tập tại nhà..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="btn-chat-send-gradient" disabled={!input.trim()}>
          <span>Gửi</span>
          <span>🚀</span>
        </button>
      </form>
    </div>
  );
}
