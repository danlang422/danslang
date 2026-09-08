---
   title: "Here: Scheduling and Attendance for Schools That Don't Fit the Mold"
   date: 2026-09-08
   tags: [posts, case-study]
---
# Here: Scheduling and Attendance for Schools That Don't Fit the Mold

*A case study by Daniel Lang*

---

## Overview

**Here** is a scheduling, attendance, and engagement app built for schools where a traditional bell schedule doesn't describe how students actually spend their day. It was designed specifically for City View Community High School in Cedar Rapids, Iowa.  A magnet high school where students split time across internships, online and community college courses, independent study, classes at other high schools, and traditional, in-person classes, often with a different mix for every single student.

![Here landing page](/assets/here-case-study/here-landing-page.png)

I'm Daniel Lang, a former high school teacher who moved into development after a full-stack bootcamp, and I started building Here while still subbing at City View after budget cuts eliminated my full time position. Here is a solo project: I designed, built, and maintained every part of it, from the database schema to the security audit.

## The problem

Traditional Student Information Systems (Infinite Campus, PowerSchool, and similar tools) assume every student follows the same set of fixed periods. That works fine for a conventional schedule, but it breaks down for a school like City View, where:

- Students rotate through **A/B day schedules**; not because City View itself uses rotating days, but because some of its students are dual-enrolled at other district high schools that do.
- Many students spend blocks of their day at **off-campus internships**, **community college courses (Kirkwood)**, or in **independent study sessions**, none of which map cleanly to a room and a bell.
- Due to state and district requirements, attendance still needs to be reported through a traditional SIS, so Here "rolls up" attendance into something a block or period-based mental model can make sense of, even when the underlying schedule is anything but.

I'd actually already tried to solve a piece of this problem once before, with an earlier tool called InternTracker, focused specifically on internship tracking. Building it taught me that the real problem was bigger than internships; it was the whole schedule. Here is the rebuild that took that lesson seriously.

## Hard problems solved

**The scheduling model.** The schema went through significant iteration before landing on its current shape. Early versions tried to handle exceptions to a student's default schedule with an override/priority system that got complicated fast. The breakthrough was realizing that students could only be in one place at one time. This sounds obvious, but it meant separating a student's enrollment in an activity from that activity's default schedule. 

For example: a student enrolled in Advisory (M–F, 7:30–9:00) who also takes a college course Tu/Th during that same window.

**Old model — priority/override:**
- Advisory: M–F, 7:30–9:00
- College Course: Tu/Th, 7:30–9:00
  - Advisory *hidden* (for staff and student) on Tu/Th, since the college course took priority — but the student's underlying enrollment was still M–F. Nothing about the Advisory enrollment itself had changed; the override just suppressed it.

**New model — individual enrollment customization:**
- Advisory: M–F, 7:30–9:00 → adjusted to **MWF only**
- College Course: Tu/Th, 7:30–9:00

The difference isn't really about how it looks on screen; both models end up showing the same schedule to users. It's what's *true underneath*. In the old model, the student was still enrolled in five days of Advisory and the UI was lying about it a little. In the new model, they're actually enrolled in three. Again, this may not seem terribly complicated, but this is just one example with clear priorities: if the student is scheduled for a college course, that takes priority over the activities at City View. But what if they're also scheduled for a rotating, "B-Day" course at another high school that partly overlaps with Advisory, the college course, or both? Rather than attempting to programmatically juggle overlapping priorities, individual enrollment customization allowed student schedules to reflect where that student was actually expected to be. That reframe is what let enrollment-level scheduling — per-student day patterns, rotation, and time overrides, all editable inline — actually ship.

**Activity 'Properties' vs. Activity 'Types'**
Another aspect of the app that ended up being particularly powerful was attaching properties to activities, rather than relying on activity 'types.' In early versions, it seemed to make sense to define various types of activity as a way of enabling or disabling certain behaviors in the app. An internship activity, for example, would require students to check-in/out with geolocation enabled. Students working independently might have a required check-in/out, but no geolocation. Both require a City View staff member to monitor attendance, whereas attendance is handled elsewhere for college courses or classes at another high school. 

Instead of baking these and other behaviors into specific activity types, Here utilizes a set of properties that can be customized for each activity, as needed: 
- Requires Attendance
    - Toggled on by default, this property can be disabled for external courses, while still allowing these courses to appear in the student agenda.
- Requires Check-In/Out
    - Activities with this property enabled will allow students to check-in and out, allowing for time tracking of activities like internships. Students are also prompted to share their plans when checking in, and progress, when checking out. 
- Enable Presence 'Wave'
    - Entirely optional, this property simply adds a virtual way for students to "say hey" and serves as an engagement hook, as well as providing an option for a less formal "check-in" in activities where students might be scattered throughout a space. 
- Allows Freeform Tagging
    - This property works in tandem with the 'Not Scheduled' property (see below), and allows students to "tag" what they're working on from a list of unscheduled activities, such as online courses. 
- Requires Geolocation
    - With this property enabled, students are prompted to share their location when checking in and out. This is typically reserved for off-site internships. Geofence radius and the location of the activity are set by admin users during activity creation. Importantly, even if the student's location is outside of the geofence radius, they are not prevented from checking in or out, but the 'out-of-bounds' state is logged and flagged for staff to review. 
- Release
    - This property simply indicates a period of time during which the student is released from campus, typically during lunch or free periods with parent and staff approval. 
- Not Scheduled
    - Activities that are "not scheduled" are typically online courses, which can be worked on at any time. These do not appear on teacher or student agendas, but can be "tagged" during activities with the "Allows Freeform Tagging" property enabled. 
- Visible to All Staff
    - This property, when enabled, makes an activity visible to all staff members, regardless of staff specifically assigned. In a small, collaborative environment like City View, responsibility for monitoring students and taking attendance is often shared between whoever is present and available at that time. For staff who are not assigned to the activity, visible-to-all activities appear in their sidebar, organized by time. There, they can view the activity roster and take attendance as needed. 

**Multi-staff activities.** Real activities often have more than one adult attached to them: a teacher and a monitor, or two co-teachers. Here replaced a rigid `teacher_id`/`monitor_id` pair on each activity with a proper `activity_staff` junction table, so any activity can carry an arbitrary set of staff with distinct roles. This also would allow for the addition of internship mentors as staff, an in-app role that was envisioned, but not built out. 

**The teacher agenda.** This went through the most design iteration of any single feature. Teachers needed a day view that reflects actual clock time rather than abstract block labels, resolves visual overlaps when activities run concurrently, clusters same-time/same-role activities instead of listing them as noise, and surfaces late arrivals without breaking the rest of the layout. It shipped as five distinct sub-areas (overlap resolution, role-aware clustering, late-arrival handling, activity or block-based attendance, and a "visible to all staff" sidebar) designed and built in sequence.

## A tour of the app

**Sign-in and the public site.** A minimal sign-in screen, and a small marketing site (landing page, About, Trust & Privacy) explaining what Here is and why it exists.

![Sign in](/assets/here-case-study/here-sign-in-ss.png)
![About page](/assets/here-case-study/here-about-page.png)

**Admin: the calendar.** The admin calendar shows every activity across every organization at a glance, with per-day-per-block popovers breaking down exactly who's staffed where.

![Admin calendar popover](/assets/here-case-study/here-admin-calendar-popover.png)

**Admin: activities.** 150 real activities, spanning traditional classes, Kirkwood courses, internships, and independent study — a decent visual sense of the scheduling variety Here has to handle day to day.

![Admin activities list](/assets/here-case-study/here-admin-activities-list-ss.png)

**Admin: users.** User management, with roles (a person can hold more than one — several staff are both teacher and admin) and grade level for students.

![Admin users list](/assets/here-case-study/here-admin-users-list-ss.png)

**Admin: attendance rollup.** The compliance view — attendance across every block for a given day, grouped and flagged by exception (absent, tardy, excused, unmarked), so an admin can see the whole school's attendance picture without opening 30 individual rosters.

![Attendance rollup](/assets/here-case-study/here-attendance-rollup.png)

**Student: today view.** Students get a clean agenda reflecting their actual, individual day — not a generic block schedule — with the ability to check in, "wave" to let staff know they're on track, and leave a short reflection note.

![Student agenda](/assets/here-case-study/here-student-agenda-ss.png)
![Student reflection](/assets/here-case-study/here-student-reflection-filled-1-ss.png)

**Off-campus check-in, with geofencing.** For internships and off-campus courses, Here can require students to be within a set radius of a real-world address to check in. Admins set the location with an address-autocomplete search when building the activity:

![Geofence address lookup](/assets/here-case-study/here-geolocation-address-lookup.png)

A short screen recording shows the student side of this: checking in, leaving a reflection note, and the confirmation turning green. The recording itself doesn't make the location check visible on-screen — the screenshot above is doing that job here.

<video controls playsinline width="100%">
  <source src="/assets/here-case-study/here-check-in-city-hall.mp4" type="video/mp4">
</video>

**Teacher: the agenda.** A teacher's actual day, laid out by real clock time, with role badges (teacher vs. monitor), clustering for concurrent activities, and a sidebar for anything visible to all staff.

![Teacher agenda](/assets/here-case-study/here-teacher-agenda-ss.png)

**Teacher: attendance.** One-tap attendance per student, including handling for students arriving late or leaving early mid-block.

![Teacher attendance](/assets/here-case-study/here-teacher-attendance-ss.png)

**Individual schedule flexibility, in motion.** A short screen recording shows two students in the same base activity getting individually customized schedules — one shifted to MWF with a later arrival time, the other set to repeat every other week — without leaving the activity's enrollment editor.

<video controls playsinline width="100%">
  <source src="/assets/here-case-study/here-individual-enrollment-override.mp4" type="video/mp4">
</video>

**Realtime updates between staff, in motion.** A short screen recording shows the core realtime behavior: one teacher takes attendance, and a moment later, a second teacher with the same roster open sees it update live, no refresh needed.

<video controls playsinline width="100%">
  <source src="/assets/here-case-study/here-realtime-attendance.mp4" type="video/mp4">
</video>

## Security: an OWASP ASVS Level 1 audit

Partway through development, I started a structured security audit against the OWASP Application Security Verification Standard (ASVS) v5.0.0, Level 1 — 70 requirements across 15 applicable chapters for this app. As of this write-up, **5 of 15 chapters are complete** (Configuration, Authorization, Authentication, Session Management, and Validation/Business Logic), covering 28 of the 70 requirements. The remaining chapters are still open.

I'm choosing to describe this honestly rather than push for a 100%-complete number: the specific, real findings below are a better signal of the audit's value than a completion percentage would be.

**What the audit found and fixed:**

- **A privilege-escalation vulnerability** — the RLS policy governing a user's own profile update had no column-level restriction, meaning any authenticated user could have assigned themselves an admin role, or moved themselves into a different organization's data, via a direct API call. Fixed with a database trigger blocking privileged self-edits, verified live against production with transactional tests that always rolled back.
- **A shared password across every non-admin account** — a holdover from early test onboarding, where one password had been set for every staff and student account. Fixed by rewriting both user-creation and password-reset flows to use Supabase's invite/reset-link system exclusively — no code path anywhere in the app can set or know another user's password anymore.
- **A session-persistence gap in password recovery** — a user clicking a recovery or invite link could navigate away before actually setting a new password and land fully logged into their account, having never completed the required step. Fixed with a durable, session-derived gate that checks on every route render, rather than a one-time redirect.

Each of these was verified live against real (test) data before being marked resolved, not just reviewed in code.

## Stack

- **Frontend:** React 19, React Router v7, Tailwind CSS v4, DaisyUI v5, TanStack Query, Zustand, React Hook Form
- **Backend:** Supabase — Postgres with Row Level Security as the primary authorization layer, Supabase Auth, three Edge Functions, and Realtime subscriptions for live attendance updates
- **Deployment:** Vercel

Here's authorization model leans on Postgres RLS rather than application-layer checks — every table's access rules are enforced at the database query level, not just hidden in the UI.

## Where things stand

Here is fully built and was piloted internally at City View. District-level adoption stalled on a procurement concern (a conflict-of-interest question, since I work at the school as a substitute) that was never fully resolved, and staff interest beyond the pilot has been limited. It isn't in active use today. I've chosen not to pursue other schools, since supporting a scheduling-critical tool for a district I don't know well isn't something I can responsibly do alone.

At this point, Here exists primarily as a demonstration of what I can design and build end-to-end: a real, non-trivial domain problem, a data model that evolved through genuine iteration rather than being right the first time, and a security posture I was willing to hold to an external standard rather than just my own judgment.
