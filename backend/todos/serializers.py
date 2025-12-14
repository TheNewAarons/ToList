from rest_framework import serializers
from .models import Task, Project, Tag, Subtask, Comment, ActivityLog, Template, TemplateItem
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'
        read_only_fields = ('user',)

class SubtaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtask
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ('user',)

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ('user',)

class ActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLog
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    project_id = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all(), source='project', write_only=True, required=False, allow_null=True
    )
    project = ProjectSerializer(read_only=True)
    subtasks = SubtaskSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(), source='tags', write_only=True, many=True, required=False
    )

    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ('user',)

class TemplateItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = TemplateItem
        fields = ['id', 'content', 'is_completed']

class TemplateSerializer(serializers.ModelSerializer):
    items = TemplateItemSerializer(many=True, required=False) # Nested items

    class Meta:
        model = Template
        fields = '__all__'
        read_only_fields = ('user',)

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        template = Template.objects.create(**validated_data)
        for item_data in items_data:
            TemplateItem.objects.create(template=template, **item_data)
        return template

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        instance = super().update(instance, validated_data)
        
        if items_data is not None:
            instance.items.all().delete() # Simple replacement strategy for now
            for item_data in items_data:
                TemplateItem.objects.create(template=instance, **item_data)
        return instance
