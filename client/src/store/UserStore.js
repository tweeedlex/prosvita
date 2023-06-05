import { makeAutoObservable } from "mobx";

export default class UserStore {
  constructor() {
    this._isAuth = false;
    this._user = {};
    this._auth = null;
    this._role = "USER";

    makeAutoObservable(this);
  }

  setIsAuth(bool) {
    this._isAuth = bool;
  }
  setUser(user) {
    this._user = user;
  }
  setAuth(auth) {
    this._auth = auth;
  }
  setRole(role) {
    this._role = role;
  }

  get isAuth() {
    return this._isAuth;
  }
  get user() {
    return this._user;
  }
  get auth() {
    return this._auth;
  }
  get role() {
    return this._role;
  }
}
