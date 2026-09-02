/* ============================================================
   ACT V — THE LETTER
   ============================================================ */
document.getElementById('openEnvelopeBtn').addEventListener('click', function(){
  this.classList.add('open');
  this.disabled = true;

  setTimeout(() => {
    document.getElementById('envelopeStage').style.display = 'none';
    const letterStage = document.getElementById('letterStage');
    letterStage.style.display = 'block';

    typeIntoLetterCard('letterParagraphs', LETTER_PARAGRAPHS, {
      onDone(){
        document.getElementById('letterContinue').classList.add('show');
      }
    });
  }, 900);
});
