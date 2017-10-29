export const html = `<!-- BEGIN THING -->
<p class="myClass">
  &amp; Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa perspiciatis laudantium cumque voluptates accusantium voluptatum magnam maiores facere tempora ducimus nobis obcaecati, animi at odit nihil, velit officia doloribus impedit!
</p>
<!-- END THING -->

## This is some markdown

> Neat-o

* _one_
* _two_

1. *three*
2. *four*`;

export const css = `h1, .h1 {
  font-size: 2em;
  -webkit-animation: spin 1s ease-out;
  color: crimson;
  font-family: sans-serif;
}

$theColor: blue;

a[href="http://example.com"] {
  &:before {
    color: $theColor;
  }
  color: #eee;
}

@media (min-width: 600px) {
  h1#hello, h1.world {
    display:none;
  }
}

@-webkit-keyframes spin {
  0% {
   transform: rotate(0);  
  }
  100% {
   transform: rotate(360deg); 
  }
}`;

export const js = `for (var i=0; i<10; i++) {
  // console.log(i);
}

function aFunc() {
  var obj = {};
  obj.isAnObject = true;
}

function Dog(opts){
  this.name = opts.name;
  this.isGoodDog = opts.isGoodDog;
  this.whosAGoodDog = function(){
    console.log( this.isGoodDog ? "me" : undefined );
  }
  this.bark = function(){
    console.log("woof");
  }
  this.sayName = function(){
    console.log(this.name);
  }
}

var myDog = new Dog({ 
  name: "aDog",
  isGoodDog: true // good pupper
});`;
