## 后端服务器api

<!---

/*

now_playing 表结构
+----------+--------------+------+-----+---------+-------+
| Field    | Type         | Null | Key | Default | Extra |
+----------+--------------+------+-----+---------+-------+
| movie_id | varchar(255) | NO   | PRI | NULL    |       |
| location | varchar(255) | NO   | PRI | NULL    |       |
+----------+--------------+------+-----+---------+-------+

movie_info 表结构
+--------------+--------------+------+-----+---------+-------+
| Field        | Type         | Null | Key | Default | Extra |
+--------------+--------------+------+-----+---------+-------+
| uid          | varchar(255) | NO   | PRI | NULL    |       |
| title        | varchar(255) | YES  |     | NULL    |       |
| rating       | varchar(255) | YES  |     | NULL    |       |
| vote_num     | varchar(255) | YES  |     | NULL    |       |
| stars5       | varchar(255) | YES  |     | NULL    |       |
| stars4       | varchar(255) | YES  |     | NULL    |       |
| stars3       | varchar(255) | YES  |     | NULL    |       |
| stars2       | varchar(255) | YES  |     | NULL    |       |
| stars1       | varchar(255) | YES  |     | NULL    |       |
| director     | text         | YES  |     | NULL    |       |
| editor       | text         | YES  |     | NULL    |       |
| actors       | text         | YES  |     | NULL    |       |
| genre        | text         | YES  |     | NULL    |       |
| country      | text         | YES  |     | NULL    |       |
| language     | text         | YES  |     | NULL    |       |
| release_date | text         | YES  |     | NULL    |       |
| duration     | text         | YES  |     | NULL    |       |
| other_name   | text         | YES  |     | NULL    |       |
| IMDb         | text         | YES  |     | NULL    |       |
| summary      | text         | YES  |     | NULL    |       |
+--------------+--------------+------+-----+---------+-------+
*/

-->

## api

服务器ip：47.121.24.255

- `/`
  - GET
  - 返回`<text>:"server is running"`
- `/mobile/movie/nowplaying/{arg1}`
  - GET
  - 参数`arg1`为用户所在地区位置的拼音，如`beijing`
  - 返回`<json>:[{"movie_id":"<movie_id>"}]`
  - 其中`<movie_id>`为电影id
- `/mobile/movie/info/{arg1}`
  - GET
  - 参数`arg1`为电影id
  - 返回`<json>:[{"movie_id":"<movie_id>","title":"<title>","rating":"<rating>","vote_num":"<vote_num>","stars5":"<stars5>","stars4":"<stars4>","stars3":"<stars3>","stars2":"<stars2>","stars1":"<stars1>","director":"<director>","editor":"<editor>","actors":"<actors>","genre":"<genre>","country":"<country>","language":"<language>","release_date":"<release_date>","duration":"<duration>","other_name":"<other_name>","IMDb":"<IMDb>","summary":"<summary>"}}]`
  - 其中`<movie_id>`为电影id，`<title>`为电影标题，`<rating>`为电影评分，`<vote_num>`为电影评分人数，`<stars5>`为5星人数，`<stars4>`为4星人数，`<stars3>`为3星人数，`<stars2>`为2星人数，`<stars1>`为1星人数，`<director>`为导演，`<editor>`为编剧，`<actors>`为演员，`<genre>`为类型，`<country>`为国家，`<language>`为语言，`<release_date>`为上映日期，`<duration>`为时长，`<other_name>`为其他名称，`<IMDb>`为IMDb链接，`<summary>`为简介
- `/mobile/movie/photo/{arg1}`
  - GET
  - 参数`arg1`为电影id
  - 返回`<jpg>:<file>`
  - 其中`<file>`为电影海报文件