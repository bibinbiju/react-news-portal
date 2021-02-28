import { Link } from "react-router-dom";
import React, { Component } from 'react';
import store from '../store';
export default class SavedArticles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            offset: 0,
            limit: 10,
        };
        this.nextPage = this.nextPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
        this.removeArticle = this.removeArticle.bind(this);
    }
    prevPage() {
        let prevOffset = ((this.state.offset - this.state.limit) >= 0) ? this.state.offset - this.state.limit : 0;
        if (prevOffset != this.state.offset)
            this.getArticleList(prevOffset);
        else alert('You reached start of the page')
    }
    nextPage() {
        let nextOffset = ((this.state.offset + this.state.limit) > this.state.totalArticles - 1) ? this.state.totalArticles - this.state.limit : this.state.offset + 20;
        if (nextOffset != this.state.offset)
            this.getArticleList(nextOffset);
        else alert('You reached end of the page')
    }
    removeArticle(articleID) {
        store.dispatch({
            type: 'REMOVE_ARTICLE',
            id: articleID
        });

    }

    render() {
        let { state } = this.props;
        let articles = state.getIn(['savedArticles']);
        return (
            <div id="container">
                <div class="row">
                    {articles.entrySeq().map((article) => {
                        article = article[1];
                        return (
                            <div class="column"  >
                                <div class="card" onClick={() => { window.open(article.get('url')) }}>
                                    <h3>{article.get('title')}</h3>
                                    <p>{article.get('abstract')}</p>
                                </div>
                                <div class="card">
                                    <button onClick={() => { this.removeArticle(article.get('id')); }}>Remove Article</button>
                                </div>
                            </div>)
                    })}

                </div>
                <div class="pagination">
                    <a href="#" onClick={this.prevPage}>❮</a>
                    <a href="#" onClick={this.nextPage}>❯</a>
                </div>
            </div >)
    }
}