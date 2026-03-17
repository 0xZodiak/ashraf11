document.addEventListener('DOMContentLoaded', () => {
    // Inject chatbot HTML into the body
    const chatbotHTML = `
        <div class="chatbot-container">
            <div class="chatbot-window" id="chatbotWindow">
                <div class="chatbot-header">
                    <h3><i class="fas fa-robot"></i> المساعد الذكي</h3>
                    <i class="fas fa-times close-chat" id="closeChat"></i>
                </div>
                <div class="chatbot-messages" id="chatMessages">
                    <div class="msg msg-bot">
                        مرحباً بك في مؤسسة أشرف عبد الفتاح! كيف يمكنني مساعدتك اليوم؟
                        <div class="msg-options">
                            <span class="msg-option" onclick="sendExampleMessage('عايز شقة')">عايز شقة</span>
                            <span class="msg-option" onclick="sendExampleMessage('سعر العمرة كام')">سعر العمرة كام؟</span>
                            <span class="msg-option" onclick="sendExampleMessage('خدمات المقاولات')">خدمات المقاولات</span>
                        </div>
                    </div>
                </div>
                <div class="chatbot-input">
                    <input type="text" id="chatInput" placeholder="اكتب سؤالك هنا..." onkeypress="handleEnter(event)">
                    <button id="sendBtn" onclick="sendMessage()"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
            <div class="chatbot-btn" id="chatbotBtn">
                <i class="fas fa-comment-dots"></i>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatbotHTML);

    const chatbotBtn = document.getElementById('chatbotBtn');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const closeChat = document.getElementById('closeChat');
    const sendBtn = document.getElementById('sendBtn');

    // Toggle chat window
    chatbotBtn.addEventListener('click', () => {
        chatbotWindow.classList.add('active');
        chatbotBtn.style.display = 'none';
        document.getElementById('chatInput').focus();
    });

    closeChat.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
        setTimeout(() => {
            chatbotBtn.style.display = 'flex';
        }, 300);
    });
});

// Expose functions globally for the onclick attributes
window.sendExampleMessage = function (text) {
    document.getElementById('chatInput').value = '';
    addMessage(text, 'user');
    processMessage(text);
};

window.handleEnter = function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
};

window.sendMessage = function () {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (text === '') return;

    input.value = '';
    addMessage(text, 'user');
    processMessage(text);
};

// Function called by the new "Ask AI" buttons on the service cards
window.askAI = function (text) {
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotBtn = document.getElementById('chatbotBtn');

    // Open chat if closed
    if (!chatbotWindow.classList.contains('active')) {
        chatbotWindow.classList.add('active');
        chatbotBtn.style.display = 'none';
    }

    // Send the message
    window.sendExampleMessage(text);
};

function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg msg-${sender}`;
    msgDiv.innerHTML = text;
    messagesContainer.appendChild(msgDiv);

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function processMessage(text) {
    // Show typing indicator
    const messagesContainer = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'msg msg-bot';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = '<i class="fas fa-ellipsis-h" style="animation: pulse-green 1s infinite;"></i>';
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    setTimeout(() => {
        // Remove typing indicator
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();

        const lowerText = text.toLowerCase();
        let response = "عذراً، لم أفهم طلبك. يمكنك زيارة أقسام موقعنا (العقارات، العمرة، المقاولات) لمزيد من المعلومات.";

        // Simple NLP pattern matching
        if (lowerText.includes('شقة') || lowerText.includes('فيلا') || lowerText.includes('عقار') || lowerText.includes('عقارات') || lowerText.includes('ارض')) {
            response = "لدينا مجموعة رائعة من الشقق والفيلات. يمكنك استعراضها في قسم العقارات.<br><br><a href='real-estate.html' class='msg-option' style='display:inline-block; margin-top:5px; text-decoration:none;'>تصفح العقارات الآن</a>";
        }
        else if (lowerText.includes('عمرة') || lowerText.includes('سعر') || lowerText.includes('عمره') || lowerText.includes('طيران') || lowerText.includes('فندق')) {
            response = "نقدم أسعاراً تنافسية لبرامج العمرة تشمل الطيران، الفنادق، والانتقالات. لمعرفة التفاصيل والأسعار الحالية تفضل بزيارة القسم الخاص بالعمرة.<br><br><a href='umrah.html' class='msg-option' style='display:inline-block; margin-top:5px; text-decoration:none;'>برامج وأسعار العمرة</a>";
        }
        else if (lowerText.includes('مقاولات') || lowerText.includes('بناء') || lowerText.includes('تشطيب') || lowerText.includes('خدمات')) {
            response = "خدماتنا في مجال المقاولات تشمل البناء المتكامل، التشطيبات، ومختلف المشاريع بجودة عالية. تفضل بزيارة صفحتنا لمشاهدة سابقة أعمالنا.<br><br><a href='construction.html' class='msg-option' style='display:inline-block; margin-top:5px; text-decoration:none;'>خدمات المقاولات</a>";
        }
        else if (lowerText.includes('سلام') || lowerText.includes('مرحبا') || lowerText.includes('هلا')) {
            response = "أهلاً بك! كيف يمكنني توجيهك اليوم في موقع المهندس أشرف عبد الفتاح؟";
        }
        else if (lowerText.includes('تواصل') || lowerText.includes('رقم') || lowerText.includes('واتساب') || lowerText.includes('مكان')) {
            response = "يمكنك التواصل معنا عبر الواتساب أو زيارتنا في مكتبنا. ألقِ نظرة على أسفل الصفحة للمزيد من التفاصيل.";
        }

        addMessage(response, 'bot');
    }, 1000); // 1-second delay for realistic feeling
}
