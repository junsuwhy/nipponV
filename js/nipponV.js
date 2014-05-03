//遊戲階段: 0:未開始, 1: 等待玩家開始遊戲 ,2: 遊戲中 , 3:結束，計分、分享
game_state = 0;

//題庫陣列
all_questions = [];

//剩下的題組陣列
my_questions = [];

//目前題目
cur_que = 0;

//目前題目數量
rounds = 0;

//目前答對數量
corrects = 0;

//目前連續答對數量
combos = 0;

//現在的題目卡片
var $cur_cards;

$(function() {
    game_change_state(0);
    d3.csv("data/question.csv", function(d) {
            return d
        },
        function(e, d) {
            all_questions = d;
            game_change_state(1);
            console.log(d);
        });

});


function game_change_state(gs) {
    game_state = gs;
    hide_all();

    $('#scene' + gs).show();

    switch (gs) {
        case 1:

            break;
        case 2:
            //狀態更新
            rounds = 0;
            corrects = 0;
            combos = 0;
            update_info();


            var max = all_questions.length,
                i = 0
                temp_arr = all_questions.concat();
            my_questions = [];
            for (i; i < max; i++) {
                rand = Math.floor(Math.random() * temp_arr.length);
                my_questions.push(temp_arr.splice(rand, 1)[0]);
            }
            get_question();

            break;
        case 3:
            $('#final_correct').text(corrects);
            break;
    }
    set_ctl(gs);

}

//清除所有場景物件
function hide_all() {
    $('[id^=scene]').hide();
}

//設定畫面上和鍵盤的動作
function set_ctl(gs) {
    rm_all_ctl();
    switch (gs) {
        case 1:
            $('#btn_start').click(function() {
                game_change_state(2);
            });
            $(document).on("keydown", function(e) {
                if (e.which == 13) {
                    game_change_state(2);
                }
            });
            break;
        case 2:
            $('#left').click(function() {
                if (cur_que.answer == 1) {
                    correct()
                } else {
                    not_correct()
                }
                update_info();
                kill_card($cur_cards, true);
                get_question();
            });

            $('#right').click(function() {
                if (cur_que.answer == 2) {
                    correct()
                } else {
                    not_correct()
                }
                update_info();
                kill_card($cur_cards, false);
                get_question();
            });
            $(document).on("keydown", function(e) {

                switch (e.which) {
                    case 37:
                        //<-
                        $('#left').click();
                        break;
                    case 39:
                        //->
                        $('#right').click();
                        break;
                };
            });

            break;
        case 3:
            $('#btn_restart').click(function() {
                game_change_state(2);
            });
            $(document).on("keydown", function(e) {
                if (e.which == 13) {
                    game_change_state(2);
                }
            });
            break;
    }
}

//清除所有動作
function rm_all_ctl() {
    $(document).off();
    $('#btn_start').off();
    $('#left').off();
    $('#right').off();
    $('#btn_restart').off();

}

//答題正確的動作
function correct() {
    corrects++;
    combos++;
}

//答題不正確的動作
function not_correct() {
    combos = 0;
}

//新的一題
function get_question() {
    if (my_questions.length == 0) {
        game_change_state(3);
        return
    }
    rounds++;
    cur_que = my_questions.pop();
    $cur_cards = $('#standby .card')
        .clone().appendTo('#question');
    $cur_word = $cur_cards.children('.word')
        .text(cur_que.question);


}





//拿掉卡片的動畫
function kill_card($card, true_if_left) {
    // $card.appendTo('#remove_que');
    $card.css({
        'position': 'absolute',
        // 'margin-top': "-=10"
    }).appendTo('#remove_que');

    if (true_if_left) {
        $card.animate({
            'margin-left': -300,
            'opacity': 0
        }, {
            duration: 500,
            specialEasing: {
                'margin-left': "easeOutQuart",
                'opacity': "linear",
            },
            'complete': function(now, fx) {
                $(this).remove();
                /* stuff to do after animation is complete */
            }
        });
    } else {
        $card.animate({
            'margin-left': 300,
            'opacity': 0
        }, {
            duration: 500,
            specialEasing: {
                'margin-left': "easeOutQuart",
                'opacity': "linear"
            },
            'complete': function(now, fx) {
                $(this).remove();
                /* stuff to do after animation is complete */
            }
        });
    }
}

// 更新數值
function update_info() {
    $('#rounds').text(rounds);
    $('#corrects').text(corrects);
    $('#combos').text(combos);
}