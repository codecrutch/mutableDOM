$MD(() => {
  let greeting = [
    "Welcome to mutableDom - A JavaScript Document Object Model Manipulation Tool",
    "Use $MD(...selector) to select ids(#main-content), classes(.dingo), or tags(p h3)",
    "",
    "Example. $MD('p').attr('style', 'color: red;')",
    "",
    "Functions:",
    "html() / html('<p>foo baz bar</p>') -- get or set html in tag(s)",
    "clearHTML() -- remove html from tag(s)",
    "append('<li>1</li>') / remove('li') -- add element(s) or remove element(s)",
    "addClass('class') / removeClass('class) -- add/remove classes to tags",
    "attr('style') -- get style attribute from tag(s)",
    "attr('style', 'color: blue;') -- set style attribute to tag/s",
    "find('p') -- finds first occurence of match",
    "forEach -- traverse mutable node list items",
    "chi"

  ]

  greeting.forEach(message => console.log(message));

  let buttons = $MD("#side-content p span");
  buttons.addClass("button");
  $MD('footer strong').attr('style', 'color: orange;');

  $MD('#ajax-buttons span').listen("click", (e) => {
    if ($MD(e.currentTarget).html() === "$MD.promise") {
      return $MD.promise({
        method: "GET",
        url: "http://api.icndb.com/jokes/random",
        data: {
          exclude: "[explicit]",
          limitTo: '[nerdy]'
        }
      }).then(
        (res) => setTimeout($MD('.center h3').html("You got a promise!: " + res), 2000),
        (error) => console.log(error)
      );
    }
    let firstName, lastName;

    firstName = "Sean";
    lastName = "Snyder";

    $MD.getJSON({
      method: "GET",
      url: "http://api.icndb.com/jokes/random",
      data: {
        firstName,
        lastName,
        exclude: "[explicit]",
        limitTo: '[nerdy]'
      }
    }).then(
      (res) => $MD('#post-content ul').append(structureJoke(res)),
      (error) => console.log(error)
    );
  });

  $MD('#clear-jokes').listen("mouseover", () => {
    $MD("#joke-list").clearHTML();
  });
});


let structureJoke = ({
  value
}) => (
  `<p>` +
  `<span>${value.joke}</span>` +
  `</p>`
);