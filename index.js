const
  request = require('superagent'),
  cheerio = require('cheerio'),
  crypto = require('crypto'),
  encrypt = require('./lib/encrypt')

const URI = {
  uri: 'http://music.163.com/weapi/song/enhance/player/url',
  login: 'http://music.163.com/weapi/login/cellphone',
  playlist: 'http://music.163.com/weapi/v3/playlist/detail',
  comment: 'http://music.163.com/weapi/v1/resource/comments/R_SO_4_',
  hotlist: 'http://music.163.com/discover/toplist?id=3778678'
}

/*
    模拟登录
*/
const login = (phone, pass) => {
  const data = encrypt({
    phone: phone,
    password: crypto.createHash('md5').
    update(pass).digest('hex'),
    rememberLogin: true,
    csrf_token: ''
  })
  return new Promise((resolve, reject) => {
    request
      .post(URI.login)
      .send({
        params: data.params,
        encSecKey: data.encSecKey
      })
      .type('form')
      .set({
        'Referer': 'http://music.163.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
      })
      .end((err, res) => {
        if (err) {
          reject(err)
          return
        }
        resolve(res.text)
      })
  })
}

/*
 * 通过歌曲 id 获取 mp3 链接
 * id: 歌曲 id
 */

const getUri = id => {
  const data = encrypt({
    br: 128000,
    csrf_token: '',
    ids: `[${id}]`
  })
  return new Promise((resolve, reject) => {
    request
      .post(URI.uri)
      .send({
        params: data.params,
        encSecKey: data.encSecKey
      })
      .type('form')
      .set({
        'Referer': 'http://music.163.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
      })
      .end((err, res) => {
        if (err) {
          reject(err)
          return
        }
        resolve(res.text)
      })
  })
}

/*
    根据歌曲id获取评论
*/
const getComments = rid => {
  const data = encrypt({
    csrf_token: ''
  })
  return new Promise((resolve, reject) => {
    request
      .post(`${URI.comment}${rid}`)
      .send({
        params: data.params,
        encSecKey: data.encSecKey
      })
      .type('form')
      .set({
        'Referer': 'http://music.163.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
      })
      .end((err, res) => {
        if (err) {
          reject(err)
          return
        }
        resolve(res.text)
      })
  })
}

/*
   通过歌单id获取所有歌曲 
*/
const getPlayList = id => {
  const data = encrypt({
    csrf_token: '',
    id: id
  })
  return new Promise((resolve, reject) => {
    request
      .post(URI.playlist)
      .send({
        params: data.params,
        encSecKey: data.encSecKey
      })
      .type('form')
      .set({
        'Referer': 'http://music.163.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
      })
      .end((err, res) => {
        if (err) {
          reject(err)
          return
        }
        resolve(res.text)
      })
  })
}

/*
    获取热门排行
*/
const getHotList = () => {
  return new Promise((resolve, reject) => {
    request
      .get(URI.hotlist)
      .set({
        'Referer': 'http://music.163.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
      })
      .end((err, res) => {
        if (err) {
          reject(err)
          return
        }
        let $ = cheerio.load(res.text, {
          decodeEntities: false
        })
        let items = $('textarea', '#song-list-pre-cache').html()
        resolve(items)
      })
  })
}


module.exports = {
  login,
  getUri,
  getPlayList,
  getComments,
  getHotList
}