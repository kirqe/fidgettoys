$(document).ready(function(){
  $.ajax({
    type: 'GET',
    url: 'https://fidgettoys-c97b9.firebaseio.com/items.json',
    dataType: 'json',
    success: function(data){
      data.map(function(item){
        // $(".cost-"+item.id).text(item.cost);
        $(".qnt-"+item.id).text(item.quantity);
      })
      $('.qnt').each(function(c){
        let cost = $(this).text();
        if (cost === "0"){
          $(this).closest(".item").addClass('sold');
        }
      })
    }
  })

  $('.popup').magnificPopup({
    type: 'image'
  });

});
