from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from .models import Task, Project, ActivityLog

@receiver(pre_save, sender=Task)
def check_task_changes(sender, instance, **kwargs):
    if instance.pk:
        try:
            old_instance = Task.objects.get(pk=instance.pk)
            instance._was_completed = old_instance.completed
            instance._old_priority = old_instance.priority
            instance._old_due_date = old_instance.due_date
        except Task.DoesNotExist:
            pass

@receiver(post_save, sender=Task)
def log_task_save(sender, instance, created, **kwargs):
    user = instance.user
    target_name = instance.title
    
    if created:
        ActivityLog.objects.create(
            user=user,
            action='CREATED',
            target_type='Task',
            target_name=target_name,
            details=f"Tarea creada: {target_name}"
        )
    else:
        # Check for specific changes if we have history
        if hasattr(instance, '_was_completed'):
            if instance.completed and not instance._was_completed:
                 ActivityLog.objects.create(
                    user=user,
                    action='COMPLETED',
                    target_type='Task',
                    target_name=target_name,
                    details=f"Tarea completada: {target_name}"
                )
                 return # Don't log generic update if it was a completion event

        # Generic Update
        ActivityLog.objects.create(
            user=user,
            action='UPDATED',
            target_type='Task',
            target_name=target_name,
            details=f"Tarea actualizada: {target_name}"
        )

@receiver(post_delete, sender=Task)
def log_task_delete(sender, instance, **kwargs):
    ActivityLog.objects.create(
        user=instance.user,
        action='DELETED',
        target_type='Task',
        target_name=instance.title,
        details=f"Tarea eliminada: {instance.title}"
    )

@receiver(post_save, sender=Project)
def log_project_save(sender, instance, created, **kwargs):
    user = instance.user
    if created:
        ActivityLog.objects.create(
            user=user,
            action='CREATED',
            target_type='Project',
            target_name=instance.name,
            details=f"Proyecto creado: {instance.name}"
        )

