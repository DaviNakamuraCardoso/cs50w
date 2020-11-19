# CSS
                     
CSS is a language that can be used to add style to an [HTML](/wiki/HTML) <em>page</em>. 
<button>1</button>
<script>
document.addEventListener("DOMContentLoaded", () => {
const btn = document.querySelector("button");
btn.addEventListener("click", () => {
let value = btn.innerHTML;
console.log(`${value}`);
btn.innerHTML = parseInt(value) + 1;

});
});

</script>

