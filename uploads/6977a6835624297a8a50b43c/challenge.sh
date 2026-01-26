#!/bin/sh

# Print boot / kernel spam ONCE
echo "[    0.000000] Linux version 6.6.12-pwm (gcc 13.2.1)"
echo "[    0.013421] ACPI: Core revision 20231101"
echo "[    0.024892] Spectre V2 mitigation: Retpolines"
echo "[    0.037112] PWM: registered pwmchip0"
echo "[    0.041876] pwm-pca9685 1-0040: registered 16 channels"
echo "[    0.052914] usbcore: registered new interface driver usbfs"
echo "[    0.064318] usbcore: registered new interface driver hub"
echo "[    0.076441] NET: Registered PF_INET protocol family"
echo "[    0.083774] TCP: Hash tables configured"
echo "[    0.092663] cryptomgr: initialized"
echo "[    0.101554] Loading PWM control module..."
echo "[    0.109882] pwm_ctrl: module verification failed: signature missing"
echo "[    0.117293] pwm_ctrl: forcing load anyway"
echo "[    0.125991] pwm_ctrl: ready"
echo "[    0.134222] systemd[1]: Started PWM Admin Console"
echo

# Initial banner ONCE
echo "=================================="
echo "     PWM ADMIN CONSOLE v1.0"
echo "=================================="
echo

# Login loop (append-only)
while true; do
  printf "login: "
  read USER

  printf "password: "
  stty -echo
  read PASS
  stty echo
  echo

  if [ "$USER" = "admin" ] && [ "$PASS" = "1234" ]; then
    echo
    echo "[+] Access granted"
    echo "[+] FLAG: $FLAG"
    exit 0
  else
    echo "[-] Access denied"
    echo "[!] pwm_ctrl: authentication failure"
    echo "[!] pwm_ctrl: retrying interface"
    echo
  fi
done
