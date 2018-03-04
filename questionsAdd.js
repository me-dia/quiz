/*****************************************MULTIPLE********************************************/
function addHorizontalDiv() {
    $("#horizontal_divs").append("<input class=\"vertical add-question__input\" type=\"text\" /> \
				<input class=\"vertical_file_alt add-question__input\" type=\"text\" placeholder=\"alt tag\" /> \
				<input class=\"vertical_file\" type=\"file\"  />  \ ");
}


function horizontalDeleteRow() {

    var id = $("#horizontal_divs").children().last().attr('id');
    if (id != null && id.indexOf("answerimage") !== -1) {
        $("#horizontal_divs").children().last().remove();
    }
    for (i = 0; i < 3; i++) {

        var tagname = $("#horizontal_divs").children().last().prop("tagName");
        if (tagname != null && tagname.indexOf("BR") !== -1) {

            $("#horizontal_divs").children().last().remove();
        }
        $("#horizontal_divs").children().last().remove();
    }
}

function addVerticalDiv() {
    $("#vertical_divs").append("<input class=\"horizontal add-question__input\" type=\"text\"  /> \ ");
}

function verticalDeleteRow() {
    $("#vertical_divs").children().last().remove();
}

/*a horizontal és vertical tömböket a horizontal és vertical class jquery each töltjük fel*/
/*a matrix class-ú divbe beleteszünk checkbox-okat aminek az id-jéből tudjuk melyik sor és oszlopról van szó*/
/*a checkbox id-je így néz ki: check-3-4, amiből split()-tel kiolvasható a sor és oszlop*/
function generateMatrix() {
    var hor = [];
    $(".horizontal").each(function () {

        hor.push($(this).val());
    });
    var ver = [];
    $(".vertical").each(function () {

        ver.push($(this).val());
    });

    var horLength = hor.length;
    var verLength = ver.length;

    /*table csak az elrendezés miatt van. Az input-okban van az információ*/
    str = '<table >';
    str += '<tr><td></td>';
    for (var i = 0; i < horLength; i++) {
        str += '<td>';
        str += hor[i] + " ";
        str += '</td>';
    }
    str += '</tr>';


    for (var i = 0; i < verLength; i++) {
        str += '<tr>';
        str += '<td>';
        str += ver[i] + " ";
        str += '</td>';
        for (var j = 0; j < horLength; j++) {
            str += '<td>';
            str += '<input class=\"checkbox\" id=\"check-' + i + '-' + j + '\" type=\"checkbox\" value=\"checked\" />';
            str += '</td>';
        }
        /*str += '<td>';
         str += '<input placeholder=\"Pontszám\" class=\"multiple_points\" type=\"text\" />';
         str += '</td>';*/
        str += '</tr>';
    }
    str += '</table>';

    $("#matrix").empty();
    $("#matrix").append(str);
}

function ajaxFileupload(file_upload) {
    var file_data = file_upload.prop('files')[0];
//var file_data = $('#sortpicture').prop('files')[0];   
    var form_data = new FormData();
    form_data.append('file', file_data);

    //url: '/wp-admin/admin-ajax.php'
    //data: {
    //			action: 'image_upload'
    //		}


    $.ajax({
        url: '/upload.php',
        dataType: 'text', // what to expect back from the PHP script, if anything
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,
        type: 'post',
        success: function (php_script_response) {
            console.log(php_script_response);
        }
    });
}

/*a checkbox-okat kiolvassuk hogyha checked(csak akkor), akkor az id-ből kiolvassuk a sor-oszlop koordinátákat */
/*a checkbox id-je így néz ki: check-3-4, amiből split()-tel kiolvasható a sor és oszlop*/
function readDataFromMatrix() {
//ajaxxal elküldjük a file-okat

    var files = [];
    index = 0;
    $(".vertical_file").each(function () {
        ajaxFileupload($(this));

        if ($(this).val() != '')//van új kép
        {

            files.push($(this).val().split('\\').pop());
        } else if ($('#answerimage-' + index).length)//van régi kép
        {

            imagepath = $('#answerimage-' + index).attr('src');
            imagefile = imagepath.split('/').pop();
            files.push(imagefile);
        } else {

            files.push($(this).val().split('\\').pop());
        }
        index++;
        //ez csak akkor kéne hogyha az ajaxFileupload tudna értéket visszaadni
        //var index = $(this).parent().children().index(this);
        //$(this).parent().eq(index).css("color", "red");
    });


///////////horizontal vizszintes fejléc vertical függőleges fejléc///////////////////////////////////////	
    var horarr = [];
    $(".horizontal").each(function () {
        horarr.push(($(this).val()));
    });


    var verarr = [];
    $(".vertical").each(function () {
        verarr.push(($(this).val()));
    });

    var verarr_alt = [];
    $(".vertical_file_alt").each(function () {
        verarr_alt.push(($(this).val()));
    });



    /*var pointarr = [];
     $(".multiple_points").each(function () {
     
     pointarr.push(removeCommas($(this).val()));
     });*/

    var checkedarr = [];
    $(".checkbox").each(function () {
        if ($(this)[0].checked) {
            splitted = $(this).attr('id').split("-");
            checkedarr.push(splitted[1] + "-" + splitted[2]);
        }
    });


    var answers = [];

    var y_axis = [];
    for (i = 0; i < verarr.length; i++) {
        var elem = {name: verarr[i], attachment: files[i], alt_tag: verarr_alt[i]}
        y_axis.push(elem);
    }
    answers.push(y_axis);

    var x_axis = [];
    for (i = 0; i < horarr.length; i++) {

        x_axis.push(horarr[i]);
    }
    answers.push(x_axis);

    var isGood = [];
    for (i = 0; i < verarr.length; i++) {

        _value = findInArray(checkedarr, i);

        /*if (pointarr[i] == "")
         point = "1";
         else
         point = pointarr[i];*/

        var elem = {value: _value/*, points: point*/}
        isGood.push(elem);
    }
    answers.push(isGood);


    /*belemásoljuk az oszlop, sor neveket és koordinátákat az answers input text-be */
    $("#answers").val(JSON.stringify(answers));
}
function findInArray(checkedarr, index) {

    for (var i = 0, len = checkedarr.length; i < len; i++) {
        splitted = checkedarr[i].split("-");
        if (splitted[0] == index)
            return checkedarr[i];
    }

    return "1000-1000";//szándékosan invalid
}
/*****************************TEXT********************************/
function textChanged() {
    //var points = removeCommas(document.getElementById("points_text").value);
    var question_text = (document.getElementById("text_type").value);
    var answers = [];
    var answer = {title: question_text, isGood: true/*, points: points*/};
    answers[0] = answer;
    $("#answers").val(JSON.stringify(answers));
}

/****************************RADIO***************************************/

function radioAddRows() {
    $("#radio_rows").append("<span>Jó válasz</span><input class=\"radio_valid\" type=\"checkbox\" value=\"valid\" />  \
                             <input class=\"radio_text\" type=\"text\" placeholder=\"Szöveg\"/>");

    radio_only_one_checked();
    //<input class=\"radio_points\" type=\"text\" placeholder=\"Pontszám\"/>");
}

function radio_only_one_checked() {
    $(".radio_valid").change(function () {
        var this_checked = this.checked;
        $(".radio_valid").each(function () {
            $(this).prop("checked", false);
        });
        this.checked = this_checked;
    });
}

function radioDeleteRow() {
    for (i = 0; i < 3; i++)
        $("#radio_rows").children().last().remove();
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}
function removeCommas(str) {
    return replaceAll(str, ",", ".");
    //return str.replace(",", ".");
}

function radioReadQuestions() {
    var answers = [];


    var valids = [];
    $(".radio_valid").each(function () {
        valids.push($(this).is(':checked'));
    });

    var question_text = [];
    $(".radio_text").each(function () {
        question_text.push(($(this).val()));
    });

    /*var points = [];
     $(".radio_points").each(function () {
     points.push(removeCommas($(this).val()));
     });*/

    for (i = 0; i < question_text.length; i++) {
        var answer = {title: question_text[i], isGood: valids[i]/*, points: points[i]*/};
        answers[i] = answer;
    }

    $("#answers").val(JSON.stringify(answers));
}
/****************************CHECKBOX***************************************/
function checkboxAddRows() {
    $("#checkbox_rows").append("<span>Jó válasz</span><input class=\"checkbox_valid\" type=\"checkbox\" value=\"valid\" />  \
				<input 	class=\"checkbox_text\" type=\"text\" 	placeholder=\"Válasz\"/	/>");

    //<input 	class=\"checkbox_points\" type=\"text\" placeholder=\"Pontszám\"/ /> ");
}

function checkboxDeleteRow() {
    for (i = 0; i < 3; i++)
        $("#checkbox_rows").children().last().remove();
}


function checkboxReadQuestions() {
    var answers = [];

    var valids = [];
    $(".checkbox_valid").each(function () {
        valids.push($(this).is(':checked'));
    });

    var question_text = [];
    $(".checkbox_text").each(function () {
        question_text.push(($(this).val()));
    });

    /*var points = [];
     $(".checkbox_points").each(function () {
     points.push(removeCommas($(this).val()));
     });*/

    for (i = 0; i < question_text.length; i++) {
        var answer = {title: question_text[i], isGood: valids[i]/*, points: points[i]*/};
        answers[i] = answer;
    }

    $("#answers").val(JSON.stringify(answers));
}

/*************************************************************************************/
//$("#type_select").change(function () {
function typeChange() {

    if (document.getElementById("type_select") == null)
        return;

    var questiontype = document.getElementById("type_select").value;

    if (questiontype == "multiple") {
        $("#multiple_questions").show();
        $("#text_questions").hide();
        $("#radio_questions").hide();
        $("#checkbox_questions").hide();
    } else if (questiontype == "text") {
        $("#multiple_questions").hide();
        $("#text_questions").show();
        $("#radio_questions").hide();
        $("#checkbox_questions").hide();
    } else if (questiontype == "radio") {
        $("#multiple_questions").hide();
        $("#text_questions").hide();
        $("#radio_questions").show();
        $("#checkbox_questions").hide();
    } else if (questiontype == "checkbox") {
        $("#multiple_questions").hide();
        $("#text_questions").hide();
        $("#radio_questions").hide();
        $("#checkbox_questions").show();
    }

    //document.getElementById("demo").innerHTML = "You selected: " + x;
    //region_id = findRegion(valueSelected);
    //name = regionName(region_id);
    //$("#region_name").val(name);
    //$("#region").val(valueSelected);
}

/***************************jQuery Validation*************************************/
var $ = jQuery;
$(document).ready(function () {
    var validator = $("#addquestion,#editquestion").validate({
        rules: {
            title: {
                required: true,
                minlength: 2
            },
            answers: {
                required: true,
                minlength: 2
            },
            description: {
                required: true,
                minlength: 2
            },
            /*contests_list: {
             required: true
             },*/
            game_good_answer_description: {
                required: true,
                minlength: 2
            },
            /* attachment: {
             required: true,
             remote: {
             url: '/wp-admin/admin-ajax.php',
             type: "post",
             data: {
             'attachment': function () {
             return $("#attachment").val();
             },
             'action': 'check_attachment'
             }
             }
             },*/
        },
        messages: {
            title: {
                required: "Add meg a címet!",
                minlength: "A névnek minimum 2 karaktert kell tartalmaznia!"
            },
            answers: {
                required: "Add meg a válaszokat!",
                minlength: "A névnek minimum 2 karaktert kell tartalmaznia!"
            },
            description: {
                required: "Add meg a leírást!",
                minlength: "A névnek minimum 2 karaktert kell tartalmaznia!"
            },
            /*contests_list: {
             required: "Add meg a verseny tipust!"
             },*/
            game_good_answer_description: {
                required: "Jó válasz leírása nincs megadva!"
            }

            /*attachment: {
             remote: jQuery.validator.format("{0} is already in use")
             },*/
        },
        // set this class to error-labels to indicate valid fields
        success: function (label) {
            // set &nbsp; as text for IE
            label.html("&nbsp;").addClass("checked");
        },
    });

    $('input[name="save"]').on('click', function (e) {
        e.preventDefault();

        var type = $('*[name="type"]').val();
        if (type === 'radio') {
            radioReadQuestions();
        } else if (type === 'checkbox') {
            checkboxReadQuestions();
        } else if (type === 'multiple') {
            readDataFromMatrix();
        }
        $('.question-form').submit();
    });


    $('input[name="preview"]').on('click', function (e) {
        e.preventDefault();
        $('input[name="preview"]').attr("action", "register.php?btnsubmit=Save");
        var questionId = $('input[name="questions_id"]').val();
        var type = $('*[name="type"]').val();
        if (type === 'radio') {
            radioReadQuestions();
        } else if (type === 'checkbox') {
            checkboxReadQuestions();
        } else if (type === 'multiple') {
            readDataFromMatrix();
        }
        //$('.question-form').submit();
        var formData = $('.question-form').serialize();
        $.ajax({
            type: "POST",
            url: '/wp-admin/admin-ajax.php',
            data: {
                'ajaxForm': formData,
                'action': 'save_preview_question'
            }
        }).done(function () {
            window.open(
                    '/question_preview/?question=' + questionId,
                    "DescriptiveWindowName",
                    "resizable,scrollbars,status"
                    );
            window.location.reload();
        });
    });


});

//a 0-s játék elhideolása a listában
$(document).ready(function () {
    if ($('#game_category_id').length) {
        $("#game_category_id").show();
        $("#option0").css("display", "none");
        $("#game_category_id option:visible").first().prop('selected', true);
    }
});

$(document).ready(function () {
    typeChange();
});


//a játék vagy verseny kiválasztásakor el kell hideolni azt a game_category-t ami nem kell
function showHide(element) {
    var str = "";
    $(".chosen_contests").each(function (index) {
        if (this.checked) {
            var e = this.id.split("-");
            str = str + e[0] + ",";
        }
    });

    if (str.charAt(str.length - 1))
        str = str.slice(0, -1);


    $("#contests_list").val(str);

    var e = element.id.split("-");
    if (e[1] > 0) {

        if (element.checked) {

            $("#game_category_id").hide();
            $("#game_category_id option:first").attr('selected', 'selected');
        } else {
            $("#game_category_id").show();
            $("#option0").css("display", "none");
            $("#game_category_id option:visible").first().prop('selected', true);
        }
    }
}

$(document).ready(function () {
    radio_only_one_checked();
});