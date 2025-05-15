
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import {
  auth, db, provider, signInWithPopup, signOut, doc, getDoc, setDoc
} from "./firebase";

export default function App() {
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [note, setNote] = useState("");
  const [timetable, setTimetable] = useState(Array(7).fill(""));

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const loadData = async (date) => {
    if (!user) return;
    const key = formatDate(date);
    const ref = doc(db, "users", user.uid, "calendar", key);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      setNote(data.note || "");
      setTimetable(data.timetable || Array(7).fill(""));
    } else {
      setNote("");
      setTimetable(Array(7).fill(""));
    }
  };

  const saveData = async () => {
    if (!user) return;
    const key = formatDate(selectedDate);
    const ref = doc(db, "users", user.uid, "calendar", key);
    await setDoc(ref, {
      note,
      timetable
    });
    alert("✅ 저장되었습니다!");
  };

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      loadData(selectedDate);
    } catch {
      alert("❌ 로그인 실패: 팝업 차단을 해제했는지 확인해주세요.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setNote("");
    setTimetable(Array(7).fill(""));
  };

  const onDateChange = (date) => {
    setSelectedDate(date);
    loadData(date);
  };

  useEffect(() => {
    if (user) loadData(selectedDate);
  }, [user]);

  return (
    <div style={{ padding: "1rem", maxWidth: "650px", margin: "0 auto" }}>
      <h1>📅 새롬고 학교 어플</h1>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        {[
          { icon: "🍱", name: "급식표", url: "https://school.koreacharts.com/school/meals/B000023143/contents.html" },
          { icon: "🏫", name: "클래스룸", url: "http://classroom.google.com/?pli=1" },
          { icon: "💬", name: "구글 챗", url: "https://mail.google.com/chat/u/0/#chat/home" },
        ].map((link, i) => (
          <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{
            flex: "1 0 30%", border: "1px solid #ccc", borderRadius: "8px",
            padding: "1rem", textAlign: "center", textDecoration: "none", background: "#f1f1f1", color: "#000"
          }}>
            <div style={{ fontSize: "1.5rem" }}>{link.icon}</div>
            <div>{link.name}</div>
          </a>
        ))}
      </div>

      <div style={{ marginBottom: "1rem" }}>
        {user ? (
          <button onClick={handleLogout}>로그아웃</button>
        ) : (
          <button onClick={handleLogin}>Google 로그인</button>
        )}
      </div>

      <Calendar value={selectedDate} onChange={onDateChange} />

      <h2 style={{ marginTop: "1.5rem" }}>{formatDate(selectedDate)} 일정</h2>

      <h3>🕐 시간표</h3>
      {timetable.map((item, i) => (
        <input
          key={i}
          value={item}
          onChange={(e) => {
            const copy = [...timetable];
            copy[i] = e.target.value;
            setTimetable(copy);
          }}
          placeholder={`${i + 1}교시 입력`}
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        />
      ))}

      <h3>📝 메모</h3>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={4}
        style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        placeholder="할 일, 준비물 등 메모"
      />

      {user && <button onClick={saveData}>☁️ 저장하기</button>}
    </div>
  );
}
