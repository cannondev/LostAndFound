import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store';

function NewThought({ closePopup }) {
  const [content, setContent] = useState('');
  const createThought = useStore((state) => state.thoughtSlice.createThought);
  const navigate = useNavigate();
  const user = useStore((state) => state.authSlice.user);

  const handleSubmit = () => {
    if (!user) {
      alert('You must be signed in to send a thought.');
      return;
    }
    const thoughtData = {
      content,
      fullName: user.fullName,
    };

    createThought(thoughtData);
    closePopup();
    navigate('/home');
  };

  return (
    <div className="pop">
      <button className="close-btn" type="button" onClick={closePopup}>
        X
      </button>

      <div className="entireForm">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your thought..."
        />
        {user && <p><strong>from: {user.fullName}</strong></p>}
        <button className="submit" type="button" onClick={handleSubmit}>
          Send Thought
        </button>
      </div>
    </div>
  );
}

export default NewThought;
