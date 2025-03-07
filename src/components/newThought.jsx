/* eslint-disable no-alert */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store';
import './Thought.css';
import flyingGif from '../images/FLY.gif';
import showToast from '../utils/toastUtils';

function NewThought({ closePopup }) {
  const [content, setContent] = useState('');
  const [showGif, setShowGif] = useState(false);
  const createThought = useStore((state) => state.thoughtSlice.createThought);
  const navigate = useNavigate();
  const user = useStore((state) => state.authSlice.user);
  const authenticated = useStore((state) => state.authSlice.authenticated);

  const handleSubmit = () => {
    if (!authenticated) {
      showToast('You must signed in to send a thought', 'error');
      return;
    }

    const thoughtData = { content, fullName: user.fullName };
    createThought(thoughtData);

    setShowGif(true);

    setTimeout(() => {
      closePopup();
      navigate('/home');
    }, 3600);
  };

  return (
    <div className={`pop ${showGif ? 'fade-out' : ''}`}>
      <button className="close-btn" type="button" onClick={closePopup}>
        X
      </button>

      {!showGif ? (
        <div className="entireForm">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts here..."
            maxLength="200"
          />
          {user && <p className="signature">~ {user.fullName}</p>}
          <button className="submit" type="button" onClick={handleSubmit}>
            Send Thought
          </button>
        </div>
      ) : (
        <img src={flyingGif} alt="Flying Paper Plane" className="flying-gif" />
      )}
    </div>
  );
}

export default NewThought;
