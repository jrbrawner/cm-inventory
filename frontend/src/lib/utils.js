import { format } from 'date-fns';

class CommonUtils {

    formatTime(time){
      return format(new Date(time), "MM/dd/yyyy");
    }
  
    getHighlightedText(text, highlight) {
      // Split text on highlight term, include term itself into parts, ignore case
      const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
      return <span>{parts.map(part => part.toLowerCase() === highlight.toLowerCase() ? <b style={{backgroundColor: "yellow"}}>{part}</b> : part)}</span>;
    }

     handleTab(e) {
      if (e.key == 'Tab') {
        e.preventDefault();
        const { selectionStart, selectionEnd } = e.target;
        var textarea = document.getElementById('rules-text');
        var text = textarea.value;
        const newText = text.substring(0, selectionStart) + '\t' + text.substring(selectionEnd, text.length)
        textarea.value = newText;
        textarea.focus()
        textarea.setSelectionRange(
          selectionStart + '\t'.length,
          selectionEnd + '\t'.length  

        );
        
      }
    }


}

export default new CommonUtils();