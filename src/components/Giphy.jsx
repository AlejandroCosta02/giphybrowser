import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./Loader";
import Paginate from "./Paginate";

function Giphy() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [search, setSearch] = useState('')
  /*pagination*/
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstImtem = indexOfLastItem - itemsPerPage

  const currentItems = data.slice(indexOfFirstImtem, indexOfLastItem)
  useEffect(() => {
    const apiLink = `https://api.giphy.com/v1/gifs/trending`;
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const results = await axios(apiLink, {
          params: {
            api_key: `h01Tera32dL2ON8WTtHvlEcCDMtjWq2C`,
            limit: 50,
          },
        });
        console.log(results);
        setData(results.data.data);
        setIsLoading(false);
      } catch (err) {
        setIsError(true);
        console.log(err);
        setTimeout( ()=> setIsError(false), 3000)
      }
    };
    fetchData();
  }, []);

  const renderGifs = () => {
    if (isLoading) {
      return <Loader />;
    }
    return currentItems.map((el) => {
      return (
        <div key={el.id} className="gif">
          <img src={el.images.fixed_height.url} />
        </div>
      );
    });
  };

  const renderError = () => {
    if(isError){
        return <div className="alert alert-danger alert-dismissible fade show" role='alert'>Unable to get Gifs, please try in few minutes.</div>
    }
  }

  const handleSearchChange = (e)=> {
    setSearch(e.target.value)
  }

  const handleClick = async e=> {
    e.preventDefault()
    setIsError(false);
    setIsLoading(true);

    try {
        const results = await axios(`https://api.giphy.com/v1/gifs/search`, {
            params: {
                api_key: `h01Tera32dL2ON8WTtHvlEcCDMtjWq2C`,
                q: search,
                limit: 50,
            },
        });
        console.log(results);
        setData(results.data.data);
        
    } catch (err) {
        setIsError(true);
        setTimeout( ()=> setIsError(false), 3000)
    }
        
    setIsLoading(false);
  }

  const pageSelected = (pageNumbers) => {
    setCurrentPage(pageNumbers)
  }
  return(
      <div className="m-2">
            {
                renderError()
            }
            <form className="form-inline justify-content-center m-2">
                <input placeholder="search" className="form-control" onChange={handleSearchChange} value={search}/>
                <button className="btn btn-primary mx-2" type="submit" onClick={handleClick}>OK</button>
            </form>
          <div className="container gifs">{renderGifs()}</div>
            <Paginate
              pageSelected={pageSelected} 
              currentPage={currentPage} 
              itemsPerPage={itemsPerPage} 
              totalItems={data.length}
            />
      </div>
      ) 
}

export default Giphy;
