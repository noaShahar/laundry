// היררכיית הכביסה - מהמלוכלך ביותר לנקי ביותר
// כל רמה מכילה פריטים שאפשר לכבס ביחד
const laundryLevels = [
    ["בגדים עם קקי"],
    ["בגדים עם פיפי"],
    ["סמרטוטי רצפה", "מגבות מטבח"],
    ["בגדים של הילדים", "מצעים", "מגבות"],
    ["פיג'מות", "תחתונים", "גרביים", "בגדי בית"],
    ["ג'ינסים", "חולצות"],
    ["בגדי ספורט"],
    ["סוודרים"]
];

// יצירת רשימה שטוחה של כל הפריטים עם הרמה שלהם
const allItems = [];
laundryLevels.forEach((level, levelIndex) => {
    level.forEach(item => {
        allItems.push({ name: item, level: levelIndex });
    });
});

// מרחק מקסימלי מותר בין פריטים (ברמות)
const MAX_DISTANCE = 2;

// משתני משחק
let currentItem1 = null;
let currentItem2 = null;
let correctCount = 0;
let wrongCount = 0;
let currentStreak = 0;
let bestStreak = 0;

// אלמנטים בדף
const item1Element = document.getElementById('item1');
const item2Element = document.getElementById('item2');
const feedbackElement = document.getElementById('feedback');
const correctElement = document.getElementById('correct');
const wrongElement = document.getElementById('wrong');
const streakElement = document.getElementById('streak');
const bestStreakElement = document.getElementById('bestStreakNum');
const btnYes = document.getElementById('btnYes');
const btnNo = document.getElementById('btnNo');
const btnNext = document.getElementById('btnNext');
const doorGlass = document.getElementById('doorGlass');
const itemsDisplay = document.getElementById('itemsDisplay');

// פונקציה לבחירת שני פריטים רנדומליים
function pickRandomItems() {
    // בחר פריט ראשון
    const index1 = Math.floor(Math.random() * allItems.length);
    currentItem1 = allItems[index1];

    // בחר פריט שני שונה מהראשון
    let index2;
    do {
        index2 = Math.floor(Math.random() * allItems.length);
    } while (index2 === index1);
    currentItem2 = allItems[index2];

    return {
        item1: currentItem1.name,
        item2: currentItem2.name
    };
}

// פונקציה לבדוק אם שני פריטים יכולים להיכבס ביחד
function canWashTogether(item1, item2) {
    // מותר אם המרחק בין הרמות הוא עד MAX_DISTANCE
    return Math.abs(item1.level - item2.level) <= MAX_DISTANCE;
}

// פונקציה להצגת שאלה חדשה
function showQuestion() {
    const items = pickRandomItems();

    item1Element.textContent = items.item1;
    item2Element.textContent = items.item2;

    // איפוס פידבק
    feedbackElement.textContent = '';
    feedbackElement.className = 'feedback';

    // הסרת אנימציות
    doorGlass.classList.remove('spinning', 'shake-machine');
    itemsDisplay.classList.remove('tumble');

    // הפעלת כפתורים
    btnYes.disabled = false;
    btnNo.disabled = false;
    btnNext.style.display = 'none';
}

// פונקציה לעדכון רצף
function updateStreak(isCorrect) {
    if (isCorrect) {
        currentStreak++;
        if (currentStreak > bestStreak) {
            bestStreak = currentStreak;
            bestStreakElement.textContent = bestStreak;
            // אנימציה מיוחדת לשיא חדש
            document.getElementById('bestStreak').classList.add('new-record');
            setTimeout(() => {
                document.getElementById('bestStreak').classList.remove('new-record');
            }, 1000);
        }
    } else {
        currentStreak = 0;
    }
    streakElement.textContent = currentStreak;

    // עדכון צבע לפי רצף
    const streakDisplay = streakElement.parentElement;
    streakDisplay.classList.remove('streak-hot', 'streak-fire', 'streak-legendary');
    if (currentStreak >= 10) {
        streakDisplay.classList.add('streak-legendary');
    } else if (currentStreak >= 5) {
        streakDisplay.classList.add('streak-fire');
    } else if (currentStreak >= 3) {
        streakDisplay.classList.add('streak-hot');
    }
}

// פונקציה לבדיקת תשובה
function checkAnswer(userAnswer) {
    const correctAnswer = canWashTogether(currentItem1, currentItem2);
    const isCorrect = userAnswer === correctAnswer;
    const distance = Math.abs(currentItem1.level - currentItem2.level);

    // עדכון ניקוד
    if (isCorrect) {
        correctCount++;
        correctElement.textContent = correctCount;

        // הודעות שונות לפי רצף
        let message = '🎉 נכון מאוד!';
        if (currentStreak >= 9) message = '🌟 אלוף/ה! מדהים!';
        else if (currentStreak >= 6) message = '🔥🔥 בוער/ת!';
        else if (currentStreak >= 4) message = '🔥 רצף מעולה!';
        else if (currentStreak >= 2) message = '✨ יופי! ממשיכים!';

        feedbackElement.textContent = message;
        feedbackElement.className = 'feedback correct';

        // אנימציית סיבוב למכונה
        doorGlass.classList.add('spinning');
        itemsDisplay.classList.add('tumble');
    } else {
        wrongCount++;
        wrongElement.textContent = wrongCount;

        // הסבר למה התשובה שגויה
        if (correctAnswer) {
            feedbackElement.textContent = `❌ טעות! הפריטים קרובים מספיק (${distance} רמות) - אפשר לכבס ביחד`;
        } else {
            feedbackElement.textContent = `❌ טעות! הפריטים רחוקים מדי (${distance} רמות) - אי אפשר ביחד`;
        }
        feedbackElement.className = 'feedback wrong';

        // אנימציית רעידה
        doorGlass.classList.add('shake-machine');
    }

    // עדכון רצף
    updateStreak(isCorrect);

    // חסימת כפתורים
    btnYes.disabled = true;
    btnNo.disabled = true;
    
    // מעבר אוטומטי לשאלה הבאה אחרי 1.5 שניות
    setTimeout(() => {
        showQuestion();
    }, 1500);
}

// פונקציה למעבר לשאלה הבאה
function nextQuestion() {
    showQuestion();
}

// התחלת המשחק
showQuestion();
