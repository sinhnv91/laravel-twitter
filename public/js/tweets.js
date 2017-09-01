var tweets = (function() {
    var item_temp = "<div class='twitter_status' id='#id#' data-id_tr='#idTr#'>" +
        "<img src='#image#' class='twitter_image'/>" +
        "<a href='http://twitter.com/#screen_name#'>#screen_name#</a> #text#<br/>" +
        "<div class='twitter_posted_at'><span class='timeago' title='#created_time#'></span><i>via #source# </i><span class='retweet-actions #retweetStatus#'><i class='fa fa-retweet' data-toggle='tooltip' data-placement='bottom' title='#retweetStatusText#'></i> </span> <div class='pull-right user-actions #followStatus#' data-user_id='#uid#'> <span class='user-actions-follow-button follow-button'> <button type='button' class='f-secondary button-text follow-text'> <span>Follow</span> </button><button type='button' class='f-primary button-text following-text'>Following </button> <button type='button' class='f-danger button-text unfollow-text'>Unfollow </button> </span></div></div></div>";
    var pub = {
        init: function() {
            pub.getUserTimeline();
            pub.getHomeTimeline();
            pub.getWhoFollowers();
        },
        getUserTimeline: function() {
            var url = '/twitter/userTimeline';
            $.ajax({
                type: 'GET',
                url: url,
                beforeSend: function() {},
                success: function(data) {
                    var temp = pub.generateTimelineTemplate(data);
                    var meId = $('.profileCard').data('user_id');
                    $('.my-tweets').prepend(temp);
                    $('.my-tweets').find('.user-actions[data-user_id="'+meId+'"]').remove();
                    $(".timeago").timeago();
                }
            });
        },
        getWhoFollowers: function() {
            var url = '/twitter/whoFollowers';
            $.ajax({
                type: 'GET',
                url: url,
                beforeSend: function() {},
                success: function(data) {
                    pub.generateFollowesTemplate(data);
                }
            });
        },
        getHomeTimeline: function() {
            var url = '/twitter/homeTimeline';
            $.ajax({
                type: 'GET',
                url: url,
                beforeSend: function() {},
                success: function(data) {
                    var temp = pub.generateTimelineTemplate(data);
                    var meId = $('.profileCard').data('user_id');
                    $('.tweets').prepend(temp);
                    $('.tweets').find('.user-actions[data-user_id="'+meId+'"]').remove();
                    $(".timeago").timeago();
                    $('[data-toggle="tooltip"]').tooltip();
                }
            });
        },
        generateFollowesTemplate: function(data) {
            var temp ='';
            $.each(data, function(i, item) {
                temp += item_temp
                    .replace("#id#", item.id)
                    .replace(/#uid#/g, item.id)
                    .replace("#image#", item.profile_image_url)
                    .replace("#source#", item.status.source)
                    .replace("#created_time#", item.created_at)
                    .replace("#text#", item.status.text)
                    .replace(/#screen_name#/g, item.screen_name)
                    .replace(/#followStatus#/g, item.following === false ? 'not-following' : 'following');
            });
            $('.followers').prepend(temp);
            $('.followers').find('.retweet-actions').remove();
            $(".timeago").timeago();
        },
        generateTimelineTemplate: function(data) {
            var temp ='';
            $.each(data, function(i, item) {
                if (typeof item.retweeted_status !== undefined && !$.isEmptyObject(item.retweeted_status)) {
                    item = item.retweeted_status;
                }
                temp += item_temp
                        .replace("#id#", item.id)
                        .replace("#idTr#", item.id_str)
                        .replace(/#uid#/g, item.user.id)
                        .replace("#image#", item.user.profile_image_url)
                        .replace("#source#", item.source)
                        .replace("#created_time#", item.created_at)
                        .replace("#text#", item.text)
                        .replace(/#screen_name#/g, item.user.screen_name)
                        .replace(/#followStatus#/g, item.user.following === false ? 'not-following' : 'following')
                        .replace(/#retweetStatus#/g, item.retweeted === false ? 'retweet' : 'undo-retweet')
                        .replace(/#retweetStatusText#/g, item.retweeted === false ? 'Retweet' : 'Undo Retweet');
            });
            return temp;
        },
        follow: function(userId) {
            var $this = $(this);
            var url = '/twitter/follow';
            $.ajax({
                type: 'POST',
                data: {user_id: userId},
                url: url,
                beforeSend: function() {},
                success: function(data) {
                    $('body').find('.user-actions[data-user_id="'+userId+'"]').removeClass('not-following')
                        .addClass('following');
                    pub.getHomeTimeline();
                },
                error: function() {
                    alert('Cannot find specified user');
                }
            });
        },
        unFollow: function(userId) {
            var $this = $(this);
            var url = '/twitter/unFollow';
            $.ajax({
                type: 'POST',
                data: {user_id: userId},
                url: url,
                beforeSend: function() {},
                success: function(data) {
                    $('body').find('.user-actions[data-user_id="'+userId+'"]').removeClass('following')
                        .addClass('not-following');
                    pub.getHomeTimeline();
                },
                error: function() {
                    alert('Cannot find specified user');
                }
            });
        },
        reTweet: function(id) {
            var $this = $(this);
            var url = '/twitter/reTweet';
            $.ajax({
                type: 'POST',
                data: {id: id},
                url: url,
                beforeSend: function() {},
                success: function(data) {
                    var arr = [];
                    arr.push(data);
                    var temp = pub.generateTimelineTemplate(arr);
                    var meId = $('.profileCard').data('user_id');
                    $('.my-tweets').prepend(temp);
                    $('.my-tweets').find('.user-actions[data-user_id="'+meId+'"]').remove();
                    $(".timeago").timeago();
                    $('[data-toggle="tooltip"]').tooltip();
                    $('body').find('.twitter_status[data-id_tr="'+id+'"]').find('.retweet-actions')
                        .removeClass('retweet')
                        .addClass('undo-retweet')
                        .find('i').attr('data-original-title', 'Undo Retweet');
                },
                error: function() {
                    alert('Cannot find tweet');
                }
            });
        },
        undoReTweet: function(id) {
            var $this = $(this);
            var url = '/twitter/undoReTweet/'+ id;
            $.ajax({
                type: 'POST',
                data: {_method: 'DELETE'},
                url: url,
                beforeSend: function() {},
                success: function(data) {
                    $('.my-tweets').find('div[data-id_tr="'+id+'"]').remove();
                    $('body').find('.twitter_status[data-id_tr="'+id+'"]').find('.retweet-actions')
                        .removeClass('undo-retweet')
                        .addClass('retweet')
                        .find('i').attr('data-original-title', 'Retweet');
                },
                error: function() {
                    alert('Cannot find tweet');
                }
            });
        }
    };
    return pub;
})(window.jQuery);

jQuery(document).ready(function() {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    tweets.init();
    jQuery('body').on('click', '.follow', function(e) {
        var uId = $(this).data('id');
        if (!uId) {
            return;
        }
        tweets.follow(uId);
    });
    jQuery('body').on('click', '.unfollow', function(e) {
        var uId = $(this).data('id');
        if (!uId) {
            return;
        }
        tweets.unFollow(uId);
    });

    jQuery('body').on('click', '.user-actions', function(e) {
        var userId = $(this).data('user_id');
        if (!userId) {
            return;
        }
        if ($(this).hasClass("following")) {
            tweets.unFollow.call(this, userId);
        } else if($(this).hasClass("not-following")) {
            tweets.follow.call(this, userId);
        }
    });
    jQuery('body').on('click', '.retweet-actions', function(e) {
        var tweetId = $(this).closest('.twitter_status').data('id_tr');
        if (!tweetId) {
            return;
        }
        if ($(this).hasClass("retweet")) {
            tweets.reTweet.call(this, tweetId);
        } else if($(this).hasClass("undo-retweet")) {
            tweets.undoReTweet.call(this, tweetId);
        }
    });
});

