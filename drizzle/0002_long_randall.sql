ALTER TABLE `students` ADD `student_name` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `students` ADD `class_name` text DEFAULT '12 DKV 1' NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_students_class_name` ON `students` (`class_name`,`student_name`);