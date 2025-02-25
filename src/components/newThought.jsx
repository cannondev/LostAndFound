import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store';

function NewThought() {
  const [content, setContent] = useState('');
  const createThought = useStore((state) => state.thoughtSlice.createThought);
  const navigate = useNavigate();

  const handleSubmit = () => {
    const thoughtData = {
      content,
      user: 'Anonymous',
      countryOriginated: 'USA',
    };

    createThought(thoughtData);
    navigate('/');
  };

  return (
    <div className="entireForm">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your thought..."
      />
      <button className="submit" type="button" onClick={handleSubmit}>
        Send Thought
      </button>
    </div>
  );
}

export default NewThought;
