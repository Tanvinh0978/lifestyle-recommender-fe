import React, { useState, useRef, useEffect } from 'react';

// BỘ TỪ KHÓA MỞ RỘNG ĐA CHIỀU (FASHION, NUTRITION, FITNESS & YOGA, LIFESTYLE)
const KEYWORDS = {
  weightLoss: [
    'giảm cân', 'giảm mỡ', 'siết mỡ', 'giảm béo', 'thon gọn', 'eo thon', 'giảm eo', 'giảm cân nhanh', 
    'giảm mỡ bụng', 'bụng dưới', 'đùi to', 'bắp tay', 'dáng quả lê', 'dáng quả táo', 'tăng cân', 'siết cơ', 'body'
  ],
  nutrition: [
    'ăn', 'thực đơn', 'bữa', 'calo', 'calorie', 'protein', 'đạm', 'carb', 'chất béo', 'fat', 
    'dinh dưỡng', 'eat clean', 'cơm', 'uống', 'nước', 'chế độ ăn', 'thâm hụt calo', 'nhịn ăn', 'intermittent fasting',
    'if 16/8', 'rau', 'yến mạch', 'ức gà', 'trứng', 'hạt'
  ],
  fitnessYoga: [
    'tập', 'bài tập', 'squat', 'push up', 'chống đẩy', 'cardio', 'hiit', 'cơ', 'gym', 'pilates', 
    'yoga', 'luyện tập', 'tạ', 'chạy bộ', 'bụng', 'mông', 'thể dục', 'pt', 'giãn cơ', 'đốt mỡ',
    'chào mặt trời', 'chiến binh', 'cây cầu', 'plank'
  ],
  fashion: [
    'mặc', 'áo', 'quần', 'váy', 'giày', 'phối', 'outfit', 'stylist', 'thời trang', 'màu', 'tone', 
    'phụ kiện', 'túi', 'lookbook', 'size', 'vest', 'blazer', 'set đồ', 'dáng', 'hack dáng', 'tôn dáng',
    'che khuyết điểm', 'đồ tập', 'legging', 'bra tập', 'cạp cao'
  ],
  about: [
    'web', 'website', 'wearwell', 'là gì', 'giới thiệu', 'tính năng', 'hướng dẫn', 'dùng thế nào', 'app'
  ]
};

function analyzeIntent(text) {
  const clean = text.toLowerCase();
  
  const isAbout = KEYWORDS.about.some(k => clean.includes(k));
  if (isAbout) return { type: 'about' };

  const hasWeightLoss = KEYWORDS.weightLoss.some(k => clean.includes(k));
  const hasNutrition = KEYWORDS.nutrition.some(k => clean.includes(k));
  const hasFitnessYoga = KEYWORDS.fitnessYoga.some(k => clean.includes(k));
  const hasFashion = KEYWORDS.fashion.some(k => clean.includes(k));

  // Nếu câu hỏi về giảm cân hoặc kết hợp nhiều yếu tố -> Tổng hợp toàn diện (Holistic Lifestyle)
  if (hasWeightLoss || (hasNutrition && hasFitnessYoga) || (hasFashion && (hasFitnessYoga || hasNutrition))) {
    return {
      type: 'holistic',
      hasWeightLoss,
      hasNutrition,
      hasFitnessYoga,
      hasFashion
    };
  }

  if (hasNutrition) return { type: 'nutrition' };
  if (hasFitnessYoga) return { type: 'fitnessYoga' };
  if (hasFashion) return { type: 'fashion' };

  // Mở rộng: Nếu người dùng chào hỏi hoặc hỏi mẹo sống khỏe/đẹp nói chung
  if (clean.includes('chào') || clean.includes('hello') || clean.includes('hi') || clean.includes('tư vấn') || clean.includes('giúp')) {
    return { type: 'greeting' };
  }

  return { type: 'open_lifestyle' };
}

export default function ProAIChatBox({ user, wardrobe = [], onTriggerToast, initialContext = 'all' }) {
  const [messages, setMessages] = useState([
    {
      id: 'm_welcome',
      sender: 'ai',
      text: `Xin chào **${user?.name || 'bạn'}**! 👑 Tôi là Trợ lý AI Độc quyền của **Wearwell PRO VIP**.\n\nTôi được thiết kế để kết nối toàn diện giữa **Thời trang (Fashion)** và **Sức khỏe & Vóc dáng (Wellness)**:\n- 🥗 **Thực đơn dinh dưỡng** thâm hụt calo, Eat Clean chuẩn thể trạng\n- 🧘 **Bài tập Gym, Cardio & các chuỗi động tác Yoga** siết cơ đốt mỡ\n- 👗 **Mẹo phối đồ hack dáng** giúp bạn luôn tự tin tỏa sáng ngay cả trong quá trình cải thiện vóc dáng!\n\n*Bạn hãy thoải mái hỏi mọi thắc mắc hoặc click các gợi ý bên dưới nhé!*`,
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

    const intent = analyzeIntent(query);

    await new Promise(r => setTimeout(r, 650));
    setIsTyping(false);

    let aiReplyText = '';
    const userCity = user?.city || 'Hà Nội';
    const userWeight = user?.weight || 51;
    const userHeight = user?.height || 163;
    const targetCalories = userWeight ? Math.round(userWeight * 28) : 1500;
    const waterLitres = (userWeight * 0.04).toFixed(1);

    if (intent.type === 'about') {
      aiReplyText = `🌟 **WEARWELL - HỆ SINH THÁI THỜI TRANG & SỨC KHỎE TOÀN DIỆN**\n\nWearwell kết hợp 3 trụ cột độc nhất trên thị trường:\n1. 🪄 **Stylist AI**: Tự động so khớp các món đồ trong Tủ Đồ Số với thời tiết tại **${userCity}** để tạo bản phối chuẩn phong cách.\n2. 🥗 **Thực đơn Eat Clean & Calo**: Thiết kế 4 bữa ăn thuần Việt chuẩn calo giúp bạn đạt mục tiêu vóc dáng bền vững.\n3. 🧘 **Bài tập Thể hình & Yoga tương tác**: Các chuỗi bài tập tại nhà không cần dụng cụ cầu kỳ.\n4. 👥 **Cộng đồng OOTD**: Tự do chia sẻ bản phối, chấm điểm AI và bình luận tương tác!`;
    } else if (intent.type === 'holistic') {
      aiReplyText = `🎯 **KẾ HOẠCH TOÀN DIỆN (DINH DƯỠNG + YOGA/GYM + MẸO PHỐI ĐỒ):**\n\nDành riêng cho vóc dáng **${userHeight}cm / ${userWeight}kg** của bạn:\n\n🥗 **1. Thực đơn dinh dưỡng thâm hụt calo khoa học:**\n- **Mục tiêu calo nạp vào:** Khoảng **${targetCalories - 300} - ${targetCalories} kcal/ngày** (thâm hụt nhẹ 300 kcal để giảm mỡ an toàn, không mệt mỏi).\n- **Bữa sáng:** Yến mạch ngâm sữa chua Hy Lạp + nửa quả táo đỏ (khoảng 320 kcal).\n- **Bữa trưa:** 120g ức gà áp chảo sốt tiêu đen + 1 chén cơm lứt + đĩa rau củ luộc ngũ sắc (khoảng 420 kcal).\n- **Bữa phụ:** 1 quả chuối hoặc 15 hạt hạnh nhân sấy mộc (100 kcal).\n- **Bữa tối:** Canh bí xanh nấu tôm + đậu hũ hấp xì dầu (khoảng 280 kcal).\n- **Uống nước:** Duy trì tối thiểu **${waterLitres} Lít nước/ngày** để tăng cường trao đổi chất.\n\n🧘 **2. Bài tập Yoga & Thể hình đốt mỡ săn chắc:**\n- **Chuỗi Yoga Chào Mặt Trời (Surya Namaskar):** Thực hiện 5 - 8 vòng vào buổi sáng giúp kéo giãn cột sống, kích hoạt hệ tiêu hóa và làm thon gọn vòng eo.\n- **Tư thế Chiến Binh II (Virabhadrasana II):** Giữ mỗi bên 45 giây giúp săn chắc cơ đùi trong và cơ mông.\n- **Plank & Mountain Climbers:** 3 hiệp x 40 giây vào buổi chiều để siết cơ bụng dưới và đốt cháy mỡ thừa.\n\n👗 **3. Bí kíp phối đồ "hack dáng" thon gọn ngay lập tức:**\n- **Chọn cạp quần:** Ưu tiên quần âu hoặc jeans **cạp cao qua rốn** ống suông đứng, kết hợp sơ vin vạt trước để tạo hiệu ứng thị giác chân dài thêm 5-7cm và giấu khéo vòng 2.\n- **Trang phục tập luyện:** Chọn set đồ tập chất liệu Spandex co giãn 4 chiều với tone màu trầm (Navy, Than củi, Rêu trầm) để tạo cảm giác thon gọn khi soi gương tập yoga.`;
    } else if (intent.type === 'nutrition') {
      aiReplyText = `🥗 **TƯ VẤN THỰC ĐƠN & DINH DƯỠNG CÁ NHÂN:**\n\nVới thể trạng **${userWeight}kg**, mục tiêu calo cân bằng của bạn là **${targetCalories} kcal**:\n- **Tỷ lệ Macro lý tưởng:** 40% Tinh bột hấp thu chậm (Khoai lang, gạo lứt, yến mạch) : 35% Đạm nạc (Ức gà, cá thu, tôm, đậu hũ) : 25% Chất béo tốt (Bơ, dầu ô-liu, hạt điều).\n- **Mẹo thải độc & nhẹ bụng:** Uống 1 ly nước ấm pha vài giọt chanh tươi ngay sau khi thức dậy.\n- **Bữa tối thanh nhẹ:** Ăn trước 19:30, hạn chế đồ chiên xào nhiều dầu mỡ để ngủ sâu giấc hơn.`;
    } else if (intent.type === 'fitnessYoga') {
      aiReplyText = `🧘 **GIÁO ÁN YOGA & LUYỆN TẬP PHỤC HỒI DÁNG:**\n\nBuổi tập 25 phút tại nhà giúp săn chắc toàn thân:\n1. **Khởi động:** Xoay khớp cổ, vai và 3 vòng Chuỗi Mèo - Bò (Cat-Cow Pose) giải phóng căng thẳng lưng dưới (3 phút).\n2. **Tư thế Cây Cầu (Bridge Pose):** 3 hiệp x 12 lần - Đẩy hông lên cao siết chặt mông và cơ đùi sau (5 phút).\n3. **Tư thế Tấm Ván Thấp (Forearm Plank):** 3 hiệp x 45 giây - Giữ thẳng trục đầu - lưng - gót chân (4 phút).\n4. **Chuỗi Chiến Binh & Góc Nghiêng:** Kéo giãn lườn eo và tăng sức bền chân (8 phút).\n5. **Thả lỏng (Savasana):** Thả lỏng toàn thân, hít sâu thở chậm trong 5 phút.\n\n*Tập đều đặn 4-5 buổi/tuần sẽ giúp dáng người thanh thoát, dẻo dai và giảm mỡ rõ rệt!*`;
    } else if (intent.type === 'fashion') {
      const wardrobeSample = wardrobe.length > 0 ? wardrobe.slice(0, 3).map(i => i.name).join(', ') : 'Sơ mi lụa, Quần âu';
      aiReplyText = `🪄 **TƯ VẤN STYLIST & PHONG CÁCH TÔN DÁNG:**\n\nĐối với thời tiết tại **${userCity}** và vóc dáng **${userHeight}cm / ${userWeight}kg**:\n- **Tỷ lệ 1/3 vàng:** Tránh mặc áo dáng dài che lửng lơ vòng 3 vì sẽ khiến người ngắn lại. Hãy sơ vin hoặc chọn áo lửng vừa chạm cạp quần.\n- **Tủ đồ hiện có:** Bạn có thể phối ngay các item (${wardrobeSample}) với tone màu tương đồng để tạo cảm giác cơ thể liền mạch, thanh thoát.\n- **Đăng lên cộng đồng:** Sau khi phối xong, bạn có thể bấm nút **"Đăng lên Cộng đồng"** ở mục Tủ Đồ Số để nhận điểm AI và góp ý từ mọi người nhé!`;
    } else if (intent.type === 'greeting') {
      aiReplyText = `Dạ chào bạn! Rất vui được đồng hành cùng bạn hôm nay. 🌸\n\nBạn đang muốn tối ưu về phần nào nhất:\n1. 🥗 **Thực đơn giảm cân & thâm hụt calo**\n2. 🧘 **Bài tập Yoga / Gym siết eo tại nhà**\n3. 👗 **Phối đồ đẹp & hack dáng từ tủ đồ của bạn**?\n\nBạn cứ nhắn chi tiết nhé, tôi sẽ gợi ý ngay!`;
    } else {
      aiReplyText = `✨ **WEARWELL LIFESTYLE ADVICE:**\n\nTôi sẵn sàng đồng hành cùng bạn để xây dựng một lối sống đẹp từ vóc dáng đến phong cách:\n- **Về sức khỏe:** Tư vấn thực đơn giảm cân/giữ dáng, lượng calo, bài tập Gym & Yoga tại nhà.\n- **Về thời trang:** Phối đồ thông minh theo thời tiết **${userCity}**, bí kíp tôn dáng và mẹo chọn phụ kiện.\n\nBạn có thể thử bấm vào các gợi ý bên dưới hoặc mô tả mong muốn của mình nhé!`;
    }

    setMessages(prev => [
      ...prev,
      {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: aiReplyText,
        isWarning: false,
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
        <button type="button" className="quick-chip-btn" onClick={() => handleQuickAction('Tôi muốn giảm cân an toàn, hãy gợi ý kết hợp thực đơn Eat Clean, bài tập Yoga/Gym và mẹo phối đồ thon gọn')}>
          🧘 Giảm cân: Thực đơn + Yoga + Phối đồ
        </button>
        <button type="button" className="quick-chip-btn" onClick={() => handleQuickAction('Lên thực đơn Eat Clean 4 bữa thâm hụt calo cho tôi hôm nay')}>
          🥗 Thực đơn thâm hụt calo hôm nay
        </button>
        <button type="button" className="quick-chip-btn" onClick={() => handleQuickAction('Gợi ý bài tập Yoga và Plank siết cơ bụng tại nhà 20 phút')}>
          🧘 Bài tập Yoga siết bụng 20p
        </button>
        <button type="button" className="quick-chip-btn" onClick={() => handleQuickAction(`Phối đồ đẹp hôm nay cho thời tiết tại ${user?.city || 'Hà Nội'}`)}>
          🪄 Gợi ý phối đồ hôm nay
        </button>
      </div>

      {/* Messages Stream */}
      <div className="chat-messages-container">
        {messages.map((m) => (
          <div key={m.id} className={`chat-message-bubble ${m.sender}`}>
            {m.sender === 'ai' && (
              <div className="msg-sender-badge">
                <span>✨ Stylist & Wellness Advisor</span>
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
          placeholder="Hỏi về giảm cân, thực đơn, bài tập Yoga/Gym hoặc mẹo phối đồ..."
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
