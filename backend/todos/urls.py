from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, ProjectViewSet, TagViewSet, SubtaskViewSet, CommentViewSet, ActivityLogViewSet, StatisticsView

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'tags', TagViewSet, basename='tag')
router.register(r'subtasks', SubtaskViewSet, basename='subtask')
router.register(r'comments', CommentViewSet, basename='comment')
router.register(r'activity', ActivityLogViewSet, basename='activity')

urlpatterns = [
    path('', include(router.urls)),
    path('statistics/', StatisticsView.as_view(), name='statistics'),
]
