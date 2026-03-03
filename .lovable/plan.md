

## সমস্যা

Sidebar-এ "Settings" দুইবার দেখাচ্ছে:
1. Nav groups-এ "Settings" গ্রুপ হিসেবে (line 108-116) — General, Preferences, Payment Gateway, SMS Settings
2. Footer-এ আবার একটি আলাদা "Settings" লিংক (line 234-247)

### সমাধান

Footer থেকে Settings লিংকটি সরিয়ে দেওয়া হবে। Nav groups-এর Settings গ্রুপটিই থাকবে কারণ সেখানে সব sub-items আছে।

### ফাইল পরিবর্তন
- `src/components/admin/AdminSidebar.tsx` — Footer থেকে Settings link ও তার নিচের Separator মুছে ফেলা (line 234-248)

