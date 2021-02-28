import { Record, List, Map, fromJS } from 'immutable';
let safeLoadMapList = (mapList, Model, defaultMap) => {
    return mapList
        ? new Map(mapList).map(m => new Model(m)).toMap()
        : (defaultMap || new Map());
};
export class State extends Record({
    users: new Map(),
    savedArticles: new Map(),
    isAuthenticated: false,
}, 'State') {
    constructor(json = {}) {
        super({
            ...json,
            users: safeLoadMapList(json.users, User),
            savedArticles: safeLoadMapList(json.savedArticles, Article),
            isAuthenticated: json.isAuthenticated || false,
        });
    }
}
export class Article extends Record({
    id: '',
    slug_name: '',
    title: "",
    abstract: "",
    url: "",
}, 'Article') {
    constructor(json = {}) {
        super({
            ...json,
        });
    }
}
export class User extends Record({
    id: '',
    name: "",
    email: "",
    password: "",
}, 'User') {
    constructor(json = {}) {
        super({
            ...json,
        });
    }
}
