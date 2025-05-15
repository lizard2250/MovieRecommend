`/mobile/movie/recommend/{arg1}`
    - GET
    - 参数`arg1`为用户id，有一初始用户id为`"123456"`
    - 返回json格式
        ```json
        {
            "uid": <uid>,
            "like_movie":[<movie_name>,...],
            "like_type":[<type_name>,...],
            "recommend_movies":[
                {
                    "movie_id": <movie_id>,
                    "movie_name": <movie_name>,
                    "ai_rating": <rating>,
                    "reason_good": <reason_good>,
                    "reason_bad": <reason_bad>,
                    "recommendation_score": <recommendation_score>,
                    "douban_rating": <douban_rating>
                },
                ...
            ]
        }
        ```
    - 错误返回`<json>:[{"error":"<error_info>"}]`
    - 其中`<uid>`为用户id，`<like_movie>`为用户喜欢的电影，`<like_type>`为用户喜欢的类型，`<movie_id>`为电影id，`<movie_name>`为电影名称，`<ai_rating>`为AI为电影评的分数，`<reason_good>`为推荐理由，`<reason_bad>`为不推荐理由，`<recommendation_score>`为推荐分数，`<douban_rating>`为豆瓣评分
    

