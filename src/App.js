import "./App.css";

import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useRef, useState } from "react";

firebase.initializeApp({
  apiKey: "AIzaSyCDxCMcuDTN1iA8BwLoaBJIIrGkdBW3GqM",
  authDomain: "chat-demo-12931.firebaseapp.com",
  projectId: "chat-demo-12931",
  storageBucket: "chat-demo-12931.appspot.com",
  messagingSenderId: "294995187562",
  appId: "1:294995187562:web:6bc0a320465d6f1901b713",
  measurementId: "G-PJBXWGV1S5",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

const signInWithGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
};

const SignIn = (props) => {
  return <button onClick={() => signInWithGoogle(auth)}>Sign In</button>;
};

const SignOut = (props) => {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
};

const ChatRoom = () => {
  const messageRef = firestore.collection("messages");
  const query = messageRef.orderBy("createdAt");
  const dummy = useRef();

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");

    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main>
        {messages &&
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        <div ref={dummy}></div>
      </main>

      <form onSubmit={sendMessage}>
        <input
          onChange={(e) => setFormValue(e.target.value)}
          value={formValue}
        />
        <button type="submit">⬆️</button>
      </form>
    </>
  );
};

const ChatMessage = ({ message: { text, uid, photoURL } }) => {
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
  debugger;

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="" />
      <p>{text}</p>
    </div>
  );
};

const App = () => {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <section>
        {user ? (
          <>
            <header>
              <SignOut />
            </header>
            <ChatRoom />
          </>
        ) : (
          <SignIn auth={auth} />
        )}
      </section>
    </div>
  );
};

export default App;
