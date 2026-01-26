# CTF Challenge Development Rules (Infra-Enforced)

These rules are **mandatory**.  
Challenges that violate them will **not be deployed**.

Infra assumes your challenge **will be compromised**.

---

## ❌ ABSOLUTELY FORBIDDEN

- ❌ Root access (`uid=0`) at any point
- ❌ `sudo` usage (binary must not exist)
- ❌ `su` giving root access
- ❌ Docker socket (`/var/run/docker.sock`)
- ❌ Host filesystem mounts
- ❌ `--privileged` containers
- ❌ `--network host`
- ❌ Hardcoded flags (in code, files, or images)
- ❌ Extra exposed ports / raw TCP services
- ❌ Internet / outbound network dependency

If your challenge relies on any of the above → **rejected**.

---

## ✅ ALLOWED (WITH CONSTRAINTS)

### Bash / Shell Access
- ✅ Bash is allowed **only as non-root user**
- ❌ Root shell is never allowed
- ❌ Privilege escalation is not allowed
- Infra will enforce:
  - non-root user
  - root account locked
  - `no-new-privileges`
  - all Linux capabilities dropped

### PWN / PWM Challenges
- ✅ Preferred: binary stdin/stdout only
- ✅ Bash allowed **only as helper**, not target
- ❌ Bash as the exploit goal is not allowed
- ❌ Challenges must not depend on root

### Web Challenges
- ❌ No debug endpoints
- ❌ No env dumping
- ❌ No stack traces
- ❌ No filesystem flag access

### Reverse Engineering
- ❌ No reliance on filesystem secrecy
- ❌ No hidden flag files
- Flag must be derived or computed

---

## 🔐 FLAG HANDLING (MANDATORY)

- Flags are injected at runtime by infra
- Allowed:
  - computed dynamically
  - printed only on correct solve path
- Forbidden:
  - `.env` files
  - hardcoded strings
  - readable flag files (`cat flag.txt`)

---

## ⚙️ INFRA ASSUMPTIONS (DO NOT RELY ON)

Infra will:
- run containers as non-root
- drop all capabilities
- enforce CPU / memory / PID limits
- disable privilege escalation
- kill idle or long-running sessions

If your challenge breaks under this → **fix the challenge**.

---

## 🧠 DESIGN PRINCIPLE

> Design a **problem**, not infrastructure.

If solving your challenge requires:
- root
- sudo
- host access
- Docker access

Then the challenge is invalid.

---

## ✅ AUTHOR CHECKLIST

Before submission, confirm:

- [ ] Works as non-root
- [ ] No sudo / su escalation
- [ ] No hardcoded flags
- [ ] No internet dependency
- [ ] No infra assumptions

---

## 📌 FINAL NOTE

Infra is not negotiable.  
Challenges must adapt to the sandbox.

