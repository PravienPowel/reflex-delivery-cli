\# Reflex — Dry Run Timing Log



\## Dry Run 1



\*\*Method:\*\* Stopwatch (continuous, section by section)

\*\*Total time:\*\* \~21 minutes (started \~0:25, ended \~21:40)



| Section | Presenter | Start | End |

|---|---|---|---|

| Title | Topster | 0:25:60 | 0:46:00 |

| Problem | Topster | 0:52:50 | 1:15:30 |

| Solution | Topster | (included above) | |

| How It Works | Topster | 1:18:40 | 1:50:48 |

| Architecture | Pravien | 1:52:30 | 2:02:50 |

| Live Demo | Morris | 2:03:14 | 12:52:00 |

| Trade-offs | Kibet | 13:40:30 | 15:50:51 |

| Trade-offs | Ann | 16:20:40 | 19:00:40 |

| Takeaway / Roadmap / Conclusion | Topster | 19:50:36 | 21:40:44 |



\*\*Target:\*\* 10 minutes

\*\*Result:\*\* \~21 minutes



\---



\## Dry Run 2



\*\*Method:\*\* Clock time (wall clock, section by section)

\*\*Total time:\*\* 27 minutes (8:14pm–8:41pm)



| Section | Presenter | Start | End |

|---|---|---|---|

| Title \& Problem | Topster | 8:14pm | 8:15pm |

| Solution | Topster | 8:15pm | 8:16pm |

| How Reflex Works | Topster | 8:16pm | 8:17pm |

| Architecture | Pravien | 8:17pm | 8:20pm |

| Live Demo | Morris | 8:21pm | 8:29pm |

| Trade-offs | Kibet | 8:30pm | 8:33pm |

| Trade-offs | Ann | 8:34pm | 8:37pm |

| Takeaway / Roadmap / Conclusion | Topster | 8:37pm | 8:41pm |



\*\*Target:\*\* 10 minutes

\*\*Result:\*\* 27 minutes



\---



\## Unclear / Confusing Points Identified



1\. \*\*Confirmation vs. Status overlap (Architecture/Trade-offs):\*\* During rehearsal, discovered that `status --update "Delivered"` could bypass the confirmation-code requirement entirely — a real functional gap, not just a communication issue. \*\*Fixed and merged into main\*\* before final submission.



2\. \*\*Reassignment / conflict handling (Trade-offs):\*\* Required team discussion to settle on the final design decision. Confirmed: "warn but allow" is the deliberate, documented trade-off — not something to change in code.



3\. \*\*Confirmation code explanation (Trade-offs/Architecture):\*\* Needed clarification on how the code is generated and how to describe it as customer-verification (not just a rider-typed code) without implying a feature that doesn't exist.



\## Key Takeaway for Day 4



Both dry runs ran significantly over the 10-minute target, with Dry Run 2 longer than Dry Run 1. We identified the live demo commands and verbose sections in Architecture and Trade-offs as the main time sinks, and trimmed them before final submission.

