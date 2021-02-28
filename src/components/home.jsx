import React, { Component } from 'react';
import store from '../store';

const axios = require('axios');
export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sectionList: [],
            articles: [],
            selectedSection: "",
            offset: 0,
            limit: 20,
            totalArticles: 20,


        };
        this.selectSection = this.selectSection.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
        this.addToReadLater = this.addToReadLater.bind(this);
    }
    getSectionList() {
        let self = this;
        axios.get('https://api.nytimes.com/svc/news/v3/content/section-list.json?api-key=uR1j3A82i48Cvvn6A4pQRWBCIhUCIvG7')
            .then(function (response) {
                self.setState({
                    sectionList: response.data.results
                });
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }
    getArticleList(offset = 0, limit = 20) {
        let self = this;
        axios.get('https://api.nytimes.com/svc/news/v3/content/all/all.json?api-key=uR1j3A82i48Cvvn6A4pQRWBCIhUCIvG7&offset=' + offset + '&limit=' + limit)
            .then(function (response) {
                self.setState({
                    articles: response.data.results,
                    totalArticles: response.data.num_results,
                    offset: offset,
                    limit: limit,
                });
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }
    prevPage() {
        let prevOffset = ((this.state.offset - 20) >= 0) ? this.state.offset - 20 : 0;
        if (prevOffset !== this.state.offset)
            this.getArticleList(prevOffset);
        else alert('You reached start of the page')
    }
    nextPage() {
        let nextOffset = ((this.state.offset + 20) > this.state.totalArticles - 1) ? this.state.totalArticles - 20 : this.state.offset + 20;
        if (nextOffset !== this.state.offset)
            this.getArticleList(nextOffset);
        else alert('You reached end of the page')
    }
    componentDidMount() {
        this.getSectionList();
        this.getArticleList();
    }
    selectSection(section) {
        this.setState({
            selectedSection: section
        })
    }
    addToReadLater(article) {
        let { state } = this.props;
        let savedArticles = state.getIn(['users', state.get('isAuthenticated'), 'savedArticles']);
        let findExist = savedArticles.find((u) => {
            return u.get('slug_name') === article.slug_name
        });
        console.log(findExist, 'findExist')
        if (!findExist) {
            store.dispatch({
                type: 'ADD_TO_READ_LATER',
                payload: article
            });
            alert('Article added to read later list!!!!');
        }
        else {
            alert('Article already added to read later list!!!!');
        }

    }

    render() {
        let articles = this.state.articles;
        let sectionList = this.state.sectionList;
        articles = articles.filter((a) => {
            return a.section.toLowerCase().includes(this.state.selectedSection.toLowerCase())
        });
        return (
            <div id="container">
                <div className="sidenav">
                    <a key='all' href='#all' onClick={() => { this.selectSection("") }}>All</a>
                    {sectionList.map((item, index) => {
                        return <a key={index} href={'#' + item.section} onClick={() => { this.selectSection(item.section) }}>{item.display_name}</a>
                    })}
                </div>

                <div className="main">
                    <div className="row">
                        
                        {(!articles.length) ? <div className="empty-article"><h5>No items to list</h5></div> : articles.map((article, index) => {
                            return (
                                <div className="column" key={index} >
                                    <div className="card" onClick={() => { window.open(article.url) }}>
                                        <img alt={article.thumbnail_standard} src={article.thumbnail_standard} />
                                        <h3>{article.title}</h3>
                                        <p>{article.abstract}</p>

                                    </div>
                                    <div className="card">
                                        <button onClick={(e) => { e.preventDefault(); this.addToReadLater(article); }}>Read Later</button>
                                    </div>
                                </div>)
                        })
                        }

                    </div>
                </div>

                <div className="pagination">
                    <a href="#" onClick={this.prevPage}>❮</a>
                    <a href="#" onClick={this.nextPage}>❯</a>
                </div>

            </div >)
    }
}