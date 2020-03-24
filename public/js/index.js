document.addEventListener('DOMContentLoaded', (event) => {
    hljs.highlightBlock(document.getElementById('preview'));
    document.getElementById('edit').focus();

    function setHeight() {
        var height = document.documentElement.scrollHeight - 40;
        document.querySelectorAll('#content')[0].style.height = `${height}px`;
    };
    setHeight();

    window.addEventListener('resize', function(event){
        setHeight();
    });

    const ctrlCode = 17; // control key
    const eCode = 69; // edit
    const nCode = 78; // new
    const sCode = 83; // save
    var previousKey = null;
    document.onkeydown = function (e) {
        e = e || window.event;
        var pressedKey = e.keyCode;
        if (previousKey === ctrlCode){
            if (pressedKey === sCode){
                document.getElementById('preview').classList.remove('hidden');
                document.getElementById('edit').classList.add('hidden');
                document.getElementById('preview').innerHTML = `<pre><code>${document.getElementById('edit').value}</code></pre>`;

                hljs.highlightBlock(document.getElementById('preview')); // See https://highlightjs.org/

                var language = hljs.highlightAuto(document.getElementById('edit').value).language;
                saveSnippet(language, document.getElementById('edit').value)
                e.preventDefault();
            } else if(pressedKey === eCode) {
                document.getElementById('preview').classList.add('hidden');
                document.getElementById('edit').classList.remove('hidden');
                document.getElementById('edit').focus();
                e.preventDefault();
            }
        } else
            previousKey = pressedKey;
    };

    function saveSnippet(language, code) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                if(this.responseText != 'false') {
                    window.history.pushState("object or string", "Page Title", `/${this.responseText}`);
                }
            }
        };
        xhttp.open("POST", "/save", true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify({language, code}));
    };
});