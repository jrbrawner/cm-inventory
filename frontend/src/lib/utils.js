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
}

export default new CommonUtils();