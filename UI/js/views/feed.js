/* global App */
(function($, App, window, undefined) {
   var msnry, item_count, item_template;

   var $el = {
      container: $('#container'),
      filter_container: $('.work-filters'),
      filter_buttons: $('.work-filters li')
   };

   var settings = {
      api: 'system',
      feeds: ['fb', 'ig', 'tw', 'vm', 'wp', 'yt'],
      initial_items: 10,
      max_items: 100
   };
   var stream = [];
   var rendered_items = 0;
   var feed_count = 0;
   var filter = false;

   /**
    * Initialize
    */
   var initialize = function() {
      // get template and load streams
      $.get('UI/js/templates/stream.mst', function(data) {
         item_template = data;
         item_count = settings.initial_items;

         fetchFeeds();

         var $container = $('#container').isotope({
            layoutMode: 'masonry',
            sortAscending: false,
            masonry: {
               columnWidth: 10,
               gutter: 20
            }
         });
      });

      // filters events
      $el.filter_buttons.on('click', function(event) {
         event.preventDefault();

         $button = $(this);
         $el.filter_buttons.removeClass('active');
         $button.addClass('active');

         if ($button.data('filter')) {
            item_count = stream.length;
            renderStream(); // make sure all posts are rendered
            filter = $button.data('filter');
         } else {
            filter = false;
         }
         applyFilter();
      });
   };

   /**
    * Apply Filter
    */
   var applyFilter = function() {
      if (filter) {
         $el.container.isotope({filter: '.' + filter});
      } else {
         $el.container.isotope({filter: false});
      }
   };

   /**
    * Fetch Feeds
    */
   var fetchFeeds = function() {
      $.each(settings.feeds, function(index, feed) {
         // ask api
         $.getJSON(settings.api + '/' + feed + '.php', function(payload) {
            $.each(payload, function(index, item) {
               stream.push(item);
            });


            feed_count++;

            // check if all streams are loaded
            if (feed_count >= settings.feeds.length) {
               stream.sort(function(a, b) {
                  return b.timestamp - a.timestamp;
               });
               renderStream();
            }
         });
      });
   };

   /**
    * Render Feed
    */
   var renderStream = function(feed) {
      // render and append each stream item
      $.each(stream, function(index, item) {
         if (index > rendered_items && index < item_count && index < settings.max_items) {
            var html = Mustache.render(item_template, item);
            var $item = $(html);
            $el.container.append($item).isotope('appended', $item);
            rendered_items = index;
            applyFilter(); // hide if set
         }
      });

      // do not render everything in the first step (performance)
      if (item_count < stream.length) {
         item_count += 10;
      }
      window.setTimeout(renderStream, 500);
   };

   initialize();

})(jQuery, App, window);
