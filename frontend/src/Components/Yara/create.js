import React from 'react';
import  YaraDataService from '../../services/yara.service';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { useParams, useNavigate } from 'react-router-dom';
import ButtonUnstyled from '@mui/base/ButtonUnstyled';


export default function App(){

    const [rule, setRule] = React.useState(null);

    const handleInput = event  => {
      setRule(event.target.value)
    }
    
    const handleSubmit = (event) => {
      event.preventDefault();
      
      fetch(`/yara?rules_text=${rule}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }).catch(function (error) {
          if (error.response)
            {
              console.log(error.response);
              console.log(rule);
            }
      })}

    return (
            <div>
              <form onSubmit={handleSubmit}>
              <TextareaAutosize
              name="rules-text"
              placeholder="Empty"
              style={{ width: 200 }}
              onChange={handleInput}
              />
              <ButtonUnstyled type="submit">{'Submit'}</ButtonUnstyled>
              </form>
            </div>
    )
}