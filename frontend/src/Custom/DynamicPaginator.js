import ReactPaginate from "react-paginate";
import React, {
    useEffect,
    useState
  } from 'react';


export default function TestingPaginator({ items, Display, totalItems, getNextPage, itemsPerPage, pageNum}) {
    // We start with an empty list of items.
    const [currentItems, setCurrentItems] = useState(items);
    const [pageCount, setPageCount] = useState();
    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [pageOffset, setPageOffset] = useState();
    
    useEffect(() => {
      // Fetch items from another resources.
      setCurrentItems(items);
      setPageCount(Math.ceil(totalItems / itemsPerPage));
      if (pageNum !== undefined){
        setPageOffset(pageNum - 1);
      }
    }, [pageOffset, items]);
    
    // Invoke when user click to request another page.
    const handlePageChange = (event) => {
      // TODO Only change displayed selected page
      // when its content is loaded in useEffect.
      //setPageOffset(event.selected);
        setPageOffset(event.selected);
        getNextPage(event.selected + 1);
      };
  
    return (
      <>
                {Display(currentItems)}
                <div className="d-flex justify-content-center">
                <ReactPaginate
                previousLabel="Previous"
                nextLabel="Next"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakLabel="..."
                breakClassName="page-item"
                breakLinkClassName="page-link"
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageChange}
                containerClassName="pagination"
                activeClassName="active"
                forcePage={pageOffset}/>
          </div>
      </>
    );
  }