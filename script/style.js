const style = document.createElement('style');
style.textContent = `
.confetti {
  position: fixed;
  top: -20px;
  width: 10px;
  height: 18px;
  background: linear-gradient(45deg, #d4b36a, #f4e6b0);
  opacity: 0.9;
  transform: rotate(${Math.random() * 360}deg);
  animation: confetti-fall 2.2s ease-in forwards;
  z-index: 50;
}
@keyframes confetti-fall {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
}
`;
document.head.appendChild(style);
