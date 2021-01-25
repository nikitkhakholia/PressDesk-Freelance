import React, { useEffect, useState } from "react";

import DatePicker from "react-datepicker";

import Base from "../Base";
import { getNewsByDateRange } from "../helper/coreapicalls";
import Cards from "../Cards/Cards";

import "react-datepicker/dist/react-datepicker.css";

export default function Archive() {
  const today = new Date();
  const [startDate, setStartDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [endDate, setEndDate] = useState(today);
  const ExampleCustomInput = ({ value, onClick }) => (
    <button className="btn-primary btn" onClick={onClick}>
      {value}
    </button>
  );

  const [news, setNews] = useState([]);
  const [modalState, setModalState] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const topics = [
    {
      _id: "5f53b8655f93960f3df852b1",
      name: "Assam",
    },
    {
      _id: "5f53b9035f93960f3df852b8",
      name: "National",
    },
    {
      _id: "5f53b94f5f93960f3df852bd",
      name: "International",
    },
    {
      _id: "5f53b9d95f93960f3df852c7",
      name: "Sports",
    },
    {
      _id: "5fc89a79f2a72f067186b3fe",
      name: "Northeast",
    },
    {
      _id: "5fcde94b0835bb064a0094f7",
      name: "Opinion",
    },
    {
      _id: "5fcde9750835bb064a0094f8",
      name: "Business",
    },
    {
      _id: "5fcde97c0835bb064a0094f9",
      name: "Politics",
    },
  ];

  // useEffect(() => {
  //   loadNews(startDate, endDate);
  // }, [startDate, endDate]);

  const loadNews = (startDate, endDate) => {
    getNewsByDateRange(startDate, endDate).then((res) => {
      if (res.error || res.length == 0) {
        setIsLoaded(false);
      } else {
        console.error(res);
        setNews(res);
        setIsLoaded(true);
      }
    });
  };

  const getSpecifiedNews = (allNews, topicId) => {
    var specifiedNews = [];
    allNews.forEach((item) => {
      var topic = item.topic;
      if (topic.includes(topicId)) {
        specifiedNews.push(item);
      }
    });
    return specifiedNews;
  };

  const handleShow = () => {
    setModalState(false);
    loadNews(startDate, endDate);
    // setShowArchive(true)
  };

  return (
    <Base>
      <div className="my-container p-3">
        <div>
          {isLoaded ? (
            <p className="text-bold-small">
              Showing News From: {startDate.toDateString()}, To:{" "}
              {endDate.toDateString()}
              {"   "}
              <button
                type="button"
                className="btn btn-danger btn-sm"
                data-toggle="modal"
                data-target="#myModal"
              >
                Change Date Range
              </button>
            </p>
          ) : null}

          {/* <!-- Modal --> */}
          <div
            className={"modal fade" + (modalState ? "show d-block" : "d-none")}
            id="myModal"
            tabindex="-1"
            role="dialog"
            aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true"
          >
            <div
              className="modal-dialog modal-dialog-centered"
              role="document"
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLongTitle">
                    Choose Range of Dates
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={handleShow}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body row">
                  <div className="col">
                    From{" "}
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      customInput={<ExampleCustomInput />}
                      maxDate={today}
                    />
                  </div>
                  <div className="col">
                    To{" "}
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      customInput={<ExampleCustomInput />}
                      minDate={startDate}
                      maxDate={today}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                    onClick={handleShow}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isLoaded ? (
          <div>
            {topics.map((topic) => (
              <div key={topic._id}>
                {getSpecifiedNews(news, topic._id).length > 0 ? (
                  <>
                    <h3 className="text-bold">{topic.name}</h3>
                    <hr
                      style={{
                        height: "1px",
                        borderWidth: "0",
                        color: "gray",
                        backgroundColor: "gray",
                      }}
                    />
                  </>
                ) : null}

                <Cards
                  newsList={getSpecifiedNews(news, topic._id).slice(0, 8)}
                  horizontal={false}
                  topicName={topic.name}
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </Base>
  );
}
