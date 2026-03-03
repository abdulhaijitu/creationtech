

## সমস্যা

`NavigationMenuList` কম্পোনেন্টে Tailwind `group` ক্লাস আছে (`navigation-menu.tsx` এ)। Header-এর প্রতিটি nav Link-এও `group` ক্লাস আছে। যখন কোনো আইটেমে হোভার করা হয়, তখন parent `NavigationMenuList`-এর `group` ট্রিগার হয় এবং সব চাইল্ড `group-hover:scale-x-100` একসাথে সক্রিয় হয়ে যায়।

## সমাধান

`src/components/layout/Header.tsx`-এ Link-এর `group` ক্লাসকে named group `group/navitem` করতে হবে এবং underline span-এর `group-hover:scale-x-100` কে `group-hover/navitem:scale-x-100` করতে হবে। এতে শুধু সেই নির্দিষ্ট Link-এ হোভার করলেই তার আন্ডারলাইন দেখাবে।

### পরিবর্তিত ফাইল
- `src/components/layout/Header.tsx` — ২টি লাইনে `group` → `group/navitem` এবং `group-hover:` → `group-hover/navitem:` পরিবর্তন

